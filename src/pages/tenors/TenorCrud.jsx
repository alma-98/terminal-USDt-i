import {
  useEffect,
  useState
} from "react";

import {
  createTenor,
  deleteTenor,
  listTenors,
  setTenorActive,
  updateTenor
} from "../../modules/tenors/tenorService.js";

import {
  TENOR_PERMISSIONS,
  canManageTenors
} from "../../modules/tenors/tenorPermissions.js";

import {
  formatTenorDays
} from "../../modules/tenors/tenorValidation.js";

const EMPTY_FORM = {
  name: "",
  days: 30,
  active: true
};

export default function TenorCrud({
  user
}) {
  const [
    tenors,
    setTenors
  ] = useState([]);

  const [
    form,
    setForm
  ] = useState(EMPTY_FORM);

  const [
    editingId,
    setEditingId
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const [
    success,
    setSuccess
  ] = useState("");

  const canRead =
    canManageTenors(
      user,
      TENOR_PERMISSIONS.READ
    );

  const canCreate =
    canManageTenors(
      user,
      TENOR_PERMISSIONS.CREATE
    );

  const canUpdate =
    canManageTenors(
      user,
      TENOR_PERMISSIONS.UPDATE
    );

  const canDelete =
    canManageTenors(
      user,
      TENOR_PERMISSIONS.DELETE
    );

  async function loadTenors() {
    try {
      setLoading(true);
      setError("");

      const result =
        await listTenors();

      setTenors(result);
    } catch (err) {
      setError(
        err?.message ||
        "Gagal mengambil data tenor."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canRead) {
      loadTenors();
    } else {
      setLoading(false);
    }
  }, [canRead]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  }

  function editTenor(tenor) {
    setEditingId(tenor.id);

    setForm({
      name: tenor.name ?? "",
      days: tenor.days ?? 30,
      active:
        tenor.active !== false
    });

    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        days: Number(form.days)
      };

      if (editingId) {
        if (!canUpdate) {
          throw new Error(
            "Anda tidak memiliki permission untuk mengubah tenor."
          );
        }

        await updateTenor(
          editingId,
          payload,
          user
        );

        setSuccess(
          "Tenor berhasil diperbarui."
        );
      } else {
        if (!canCreate) {
          throw new Error(
            "Anda tidak memiliki permission untuk membuat tenor."
          );
        }

        await createTenor(
          payload,
          user
        );

        setSuccess(
          "Tenor berhasil dibuat."
        );
      }

      resetForm();

      await loadTenors();
    } catch (err) {
      setError(
        err?.message ||
        "Operasi tenor gagal."
      );
    }
  }

  async function handleDelete(
    tenor
  ) {
    if (!canDelete) {
      setError(
        "Anda tidak memiliki permission untuk menghapus tenor."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Hapus tenor "${tenor.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteTenor(
        tenor.id,
        user
      );

      setSuccess(
        "Tenor berhasil dihapus."
      );

      await loadTenors();
    } catch (err) {
      setError(
        err?.message ||
        "Gagal menghapus tenor."
      );
    }
  }

  async function toggleActive(
    tenor
  ) {
    if (!canUpdate) {
      setError(
        "Anda tidak memiliki permission untuk mengubah status tenor."
      );
      return;
    }

    try {
      setError("");

      await setTenorActive(
        tenor.id,
        !tenor.active,
        user
      );

      await loadTenors();
    } catch (err) {
      setError(
        err?.message ||
        "Gagal mengubah status tenor."
      );
    }
  }

  if (!canRead) {
    return (
      <section className="dashboard-panel">
        <h2>Tenor</h2>

        <p>
          Anda tidak memiliki permission
          untuk melihat Tenor.
        </p>
      </section>
    );
  }

  return (
    <section className="tenor-crud">

      <div className="dashboard-panel">

        <div className="tenor-header">
          <div>
            <span className="eyebrow">
              TENOR MASTER
            </span>

            <h2>
              {editingId
                ? "Edit Tenor"
                : "Create Tenor"}
            </h2>
          </div>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            {success}
          </div>
        )}

        {(editingId
          ? canUpdate
          : canCreate) && (

          <form
            className="tenor-form"
            onSubmit={handleSubmit}
          >

            <label>
              Nama Tenor

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="30 Hari"
                required
              />
            </label>

            <label>
              Durasi

              <input
                name="days"
                type="number"
                min="1"
                max="3650"
                value={form.days}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Status

              <select
                name="active"
                value={
                  form.active
                    ? "active"
                    : "inactive"
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      active:
                        event.target.value ===
                        "active"
                    })
                  )
                }
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </label>

            <button
              type="submit"
              className="primary-button"
            >
              {editingId
                ? "Update Tenor"
                : "Create Tenor"}
            </button>

          </form>
        )}
      </div>

      <div className="dashboard-panel">

        <div className="tenor-header">

          <div>
            <span className="eyebrow">
              TENOR MASTER
            </span>

            <h2>
              Daftar Tenor
            </h2>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadTenors}
          >
            Refresh
          </button>

        </div>

        {loading ? (

          <div className="info-box">
            Loading tenor...
          </div>

        ) : tenors.length === 0 ? (

          <div className="info-box">
            Belum ada tenor.
          </div>

        ) : (

          <div className="tenor-table-wrapper">

            <table className="tenor-table">

              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Durasi</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {tenors.map(
                  (tenor) => (

                    <tr key={tenor.id}>

                      <td>
                        <strong>
                          {tenor.name}
                        </strong>
                      </td>

                      <td>
                        {formatTenorDays(
                          tenor.days
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          className="status-button"
                          disabled={!canUpdate}
                          onClick={() =>
                            toggleActive(
                              tenor
                            )
                          }
                        >
                          {tenor.active
                            ? "Active"
                            : "Inactive"}
                        </button>

                      </td>

                      <td>

                        <div className="action-row">

                          {canUpdate && (
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() =>
                                editTenor(
                                  tenor
                                )
                              }
                            >
                              Edit
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              className="danger-button"
                              onClick={() =>
                                handleDelete(
                                  tenor
                                )
                              }
                            >
                              Delete
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </section>
  );
}

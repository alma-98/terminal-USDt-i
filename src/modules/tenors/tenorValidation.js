export function validateTenor(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Tenor data tidak valid.");
  }

  const name = String(data.name ?? "").trim();
  const days = Number(data.days);

  if (!name) {
    throw new Error("Nama tenor wajib diisi.");
  }

  if (name.length > 100) {
    throw new Error(
      "Nama tenor maksimal 100 karakter."
    );
  }

  if (
    !Number.isInteger(days) ||
    days <= 0 ||
    days > 3650
  ) {
    throw new Error(
      "Durasi tenor harus integer antara 1 sampai 3650 hari."
    );
  }

  return {
    name,
    days,
    active:
      data.active === undefined
        ? true
        : Boolean(data.active)
  };
}

export function formatTenorDays(days) {
  const value = Number(days);

  if (!Number.isInteger(value) || value <= 0) {
    return "-";
  }

  if (value === 1) {
    return "1 hari";
  }

  return `${value} hari`;
}

export function validateHashRecord(data = {}) {
  const errors = {};

  if (!data.transactionId) {
    errors.transactionId = 'Transaction ID wajib diisi.';
  }

  if (!data.hashNumber || Number(data.hashNumber) < 1) {
    errors.hashNumber = 'Hash number minimal 1.';
  }

  if (!data.hash) {
    errors.hash = 'TX Hash wajib diisi.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateHashEdit(data = {}) {
  const errors = {};

  if (!data.hashRecordId) {
    errors.hashRecordId = 'Hash record wajib dipilih.';
  }

  if (!data.newHash) {
    errors.newHash = 'Hash baru wajib diisi.';
  }

  if (!data.reason) {
    errors.reason = 'Reason wajib diisi.';
  }

  if (!data.user) {
    errors.user = 'User wajib tersedia.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-change-password");
  const modal = document.getElementById("change-password-modal");
  const cancelBtn = document.getElementById("cp-cancel");
  const form = document.getElementById("change-password-form");
  const newPwd = document.getElementById("newPassword");
  const confirmPwd = document.getElementById("confirmNewPassword");
  const errEl = document.getElementById("cp-error");

  if (!openBtn || !modal || !cancelBtn || !form) return;

  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    errEl.style.display = "none";
    errEl.textContent = "";
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Simple client-side validation: new and confirm must match
  form.addEventListener("submit", (e) => {
    if (!newPwd || !confirmPwd) return;
    if (newPwd.value !== confirmPwd.value) {
      e.preventDefault();
      errEl.style.display = "block";
      errEl.textContent = "Le nuove password non coincidono.";
      return false;
    }

    // allow form to submit normally so server can set session/cookie and redirect
    return true;
  });
});

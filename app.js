const form = document.querySelector("#lookup-form");
const identityInput = document.querySelector("#identity-number");
const message = document.querySelector("#lookup-message");

identityInput.addEventListener("input", () => {
  identityInput.value = identityInput.value.replace(/\D/g, "").slice(0, 12);
  message.textContent = "";
  message.classList.remove("success");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const identityNumber = identityInput.value.trim();

  if (!/^\d{12}$/.test(identityNumber)) {
    message.textContent = "Vui lòng nhập đủ 12 chữ số căn cước để tra cứu.";
    message.classList.remove("success");
    identityInput.focus();
    return;
  }

  message.textContent = "Giao diện đã sẵn sàng. Cần kết nối dữ liệu hồ sơ chính thức để tra cứu số này.";
  message.classList.add("success");
});

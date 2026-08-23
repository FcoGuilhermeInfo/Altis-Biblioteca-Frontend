const cpfInput = document.querySelector('[name="cpf"]');
const telefoneInput = document.querySelector('[name="telefone"]');

if (cpfInput) {
  cpfInput.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '').slice(0, 11);

    if (value.length <= 3) {
      this.value = value;
    } else if (value.length <= 6) {
      this.value = value.replace(/(\d{3})(\d)/, '$1.$2');
    } else if (value.length <= 9) {
      this.value = value.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
    } else {
      this.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
    }
  });
}

if (telefoneInput) {
  telefoneInput.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '').slice(0, 11);

    if (value.length <= 2) {
      this.value = value;
    } else if (value.length <= 6) {
      this.value = value.replace(/(\d{2})(\d)/, '($1) $2');
    } else if (value.length <= 10) {
      this.value = value.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3');
    } else {
      this.value = value.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
    }
  });
}

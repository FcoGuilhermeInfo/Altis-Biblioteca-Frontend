const formCadastro = document.querySelector(".cadastro-form");

if (formCadastro) {
  formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = formCadastro.querySelector('[name="nome"]').value.trim();
    const dataNascimento = formCadastro.querySelector('[name="nascimento"]').value;
    const cpf = formCadastro.querySelector('[name="cpf"]').value.trim();
    const telefone = formCadastro.querySelector('[name="telefone"]').value.trim();
    const endereco = formCadastro.querySelector('[name="endereco"]').value.trim();
    const email = formCadastro.querySelector('[name="email"]').value.trim();
    const senha = formCadastro.querySelector('[name="senha"]').value;
    const confirmarSenha = formCadastro.querySelector('[name="confirmar-senha"]').value;

    if (!nome) {
      alert("Digite seu nome.");
      return;
    }

    if (!dataNascimento) {
      alert("Selecione sua data de nascimento.");
      return;
    }

    if (!email) {
      alert("Digite seu e-mail.");
      return;
    }

    if (senha.length < 8) {
      alert("A senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("locbooksUsers")) || [];

    const emailExiste = usuarios.some((usuario) => usuario.email?.toLowerCase() === email.toLowerCase());

    if (emailExiste) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    const usuario = {
      id: Date.now(),
      nome,
      dataNascimento,
      cpf,
      telefone,
      endereco,
      email,
      senha,
    };

    usuarios.push(usuario);
    localStorage.setItem("locbooksUsers", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    formCadastro.reset();
    window.location.href = "login.html";
  });
}
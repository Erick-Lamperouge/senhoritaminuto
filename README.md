# Senhorita Minuto

Hub de projetos em Astro, preparado para GitHub Pages e domínio próprio.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Publicação no GitHub Pages

1. Crie um repositório chamado `<SEU-USUARIO>.github.io`.
2. Envie todo o conteúdo deste projeto para a branch `main`.
3. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions** como Source.
4. O workflow `.github/workflows/deploy.yml` fará o build e o deploy.
5. O arquivo `public/CNAME` já contém `senhoritaminuto.com.br`.
6. Depois configure os DNS no Registro.br conforme a documentação do GitHub Pages.

## Projetos iniciais

- Scratch: https://scratch.mit.edu/projects/1280541113/
- FERNANDO: https://fernando-acls.vercel.app/

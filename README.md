# Resumos e Esquemas PRF 2027

Página de vendas estática (HTML + CSS + JS puro, sem build).

## Endereço

https://prf.aprovadobizurado.com.br

Projeto próprio na Vercel, separado do pcba2. O subdomínio `prf` aponta direto para este
projeto, então os caminhos de imagem, CSS e JS começam na raiz (`/assets/...`), sem prefixo.

DNS (Hostinger, zona aprovadobizurado.com.br):

| Tipo  | Nome | Valor                |
|-------|------|----------------------|
| CNAME | prf  | cname.vercel-dns.com |

## Publicar na Vercel

1. Importe este repositório em vercel.com/new.
2. **Framework Preset:** Other. **Build Command:** vazio. **Output Directory:** vazio (raiz do projeto).
3. Deploy.
4. Settings → Domains → adicione `prf.aprovadobizurado.com.br`.

Cada `git push` na branch `main` publica de novo automaticamente.

## Rodar localmente

```
python -m http.server 8850
```

Abra http://localhost:8850/

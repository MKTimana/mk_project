# MKTECH Website

Website institucional da MKTECH desenvolvido com Next.js, React e TypeScript.

O projeto inclui a página pública da empresa, formulário de contacto por email, secção de portfólio gerida por dados JSON e uma área administrativa simples para criar, editar e remover projetos do portfólio.

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- Nodemailer para envio de emails
- Cloudflare R2 ou Cloudflare Images para upload de imagens do portfólio
- AWS SDK S3 Client para integracao com R2

## Estrutura principal

```text
app/
  page.tsx                  Pagina inicial
  layout.tsx                Layout global
  admin/page.tsx            Área administrativa
  api/contact/route.ts      Endpoint do formulário de contacto
  api/portfolio/route.ts    Endpoint público do portfólio
  api/admin/*               Endpoints protegidos do admin

components/home/
  HomePage.tsx              Composicao da pagina inicial
  Header.tsx                Navegacao
  Hero.tsx                  Secção inicial
  About.tsx                 Sobre a empresa
  Services.tsx              Serviços
  Portfolio.tsx             Portfólio
  Clients.tsx               Clientes
  Team.tsx                  Equipa
  Contact.tsx               Formulario de contacto
  Footer.tsx                Rodape

data/
  site.ts                   Conteudo principal do website
  portfolio.json            Projetos exibidos no portfólio

lib/
  adminAuth.ts              Login e sessao do admin
  portfolioStore.ts         Leitura, escrita e upload de imagens do portfólio

public/assets/
  img/                      Imagens publicas do site
  css/next-overrides.css    Ajustes de estilos herdados
```

## Como executar localmente

Instalar dependencias:

```powershell
npm install
```

Criar o ficheiro de ambiente:

```powershell
Copy-Item .env.example .env
```

Iniciar o servidor de desenvolvimento:

```powershell
npm run dev
```

Depois abrir:

```text
http://localhost:3000
```

## Scripts disponiveis

```powershell
npm run dev
```

Inicia o projeto em modo desenvolvimento.

```powershell
npm run dev:clean
```

Remove a pasta `.next` e inicia o desenvolvimento novamente.

```powershell
npm run build
```

Gera a versão de produção.

```powershell
npm run start
```

Executa a versão de produção depois do build.

```powershell
npm run lint
```

Executa o lint configurado no projeto.

## Variaveis de ambiente

As variaveis devem ficar no ficheiro `.env` localmente e no painel do Vercel em `Project Settings > Environment Variables`.

```env
SMTP_HOST=""
SMTP_PORT=""
SMTP_SECURE=""
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM_EMAIL=""
CONTACT_TO_EMAIL=""
ADMIN_USERS='[{"email":"admin@mktech.co.mz","password":"change-me","role":"admin"},{"email":"editor@mktech.co.mz","password":"change-me","role":"editor"}]'

PORTFOLIO_UPLOAD_PROVIDER="r2"
PORTFOLIO_DATA_KEY="data/portfolio.json"
CLIENTS_DATA_KEY="data/clients.json"
CATEGORIES_DATA_KEY="data/categories.json"

CLOUDFLARE_R2_ACCOUNT_ID=""
CLOUDFLARE_R2_ACCESS_KEY_ID=""
CLOUDFLARE_R2_SECRET_ACCESS_KEY=""
CLOUDFLARE_R2_BUCKET=""
CLOUDFLARE_R2_PUBLIC_URL=""

CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_IMAGES_TOKEN=""
CLOUDFLARE_IMAGES_DELIVERY_HASH=""
CLOUDFLARE_IMAGES_VARIANT="public"
```

### Email de contacto

O endpoint `app/api/contact/route.ts` recebe os dados do formulario e envia um email usando SMTP.

Variaveis obrigatorias para o envio:

- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`

Variaveis opcionais:

- `SMTP_PORT`, por padrao `587`
- `SMTP_SECURE`, usar `true` para porta `465`
- `SMTP_FROM_EMAIL`, caso queira usar um remetente diferente do `SMTP_USER`
- `CONTACT_TO_EMAIL`, destino das mensagens recebidas

## Portfólio

Os projetos do portfólio ficam em:

```text
data/portfolio.json
```

Em desenvolvimento local, o projeto pode ler e escrever nesse ficheiro. Em produção no Vercel, o sistema de ficheiros é somente leitura, por isso as alterações feitas no admin devem ser guardadas no Cloudflare R2.

A chave usada para guardar o JSON no R2 e definida por:

```env
PORTFOLIO_DATA_KEY="data/portfolio.json"
CLIENTS_DATA_KEY="data/clients.json"
CATEGORIES_DATA_KEY="data/categories.json"
```

A pagina publica consome os projetos atraves de:

```text
app/api/portfolio/route.ts
```

A area administrativa usa os endpoints em:

```text
app/api/admin/portfolio
```

As imagens podem ser guardadas de tres formas:

- Cloudflare R2, quando `PORTFOLIO_UPLOAD_PROVIDER="r2"` e as variaveis R2 estao configuradas.
- Cloudflare Images, quando `PORTFOLIO_UPLOAD_PROVIDER="images"` e as variaveis Cloudflare Images estao configuradas.
- Localmente em `public/assets/img/portfolio`, caso nenhuma integracao remota esteja configurada.

Para deploy no Vercel, use Cloudflare R2 para guardar o JSON do portfólio e Cloudflare R2 ou Cloudflare Images para guardar as imagens, porque escrita local em produção não é persistente.

## Área administrativa

A area administrativa esta disponivel em:

```text
/admin
```

O login e a sessao sao controlados em:

```text
lib/adminAuth.ts
```

Antes de colocar o projeto em produção, altere as credenciais do admin e, idealmente, mova-as para variáveis de ambiente.

O acesso por roles e configurado com `ADMIN_USERS`.

```env
ADMIN_USERS='[{"email":"admin@mktech.co.mz","password":"senha-forte","role":"admin"},{"email":"editor@mktech.co.mz","password":"senha-forte","role":"editor"}]'
```

- `admin`: pode criar, ver, editar e apagar.
- `editor`: pode criar, ver e editar, mas não pode apagar.

## Deploy no Vercel

1. Enviar o projeto para um repositorio GitHub.
2. Entrar no Vercel e escolher `Add New Project`.
3. Importar o repositorio.
4. Confirmar que o framework detectado e `Next.js`.
5. Adicionar as variaveis de ambiente.
6. Fazer deploy.

Configuração recomendada:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: default
```

## Observacoes importantes

- O ficheiro `.env` não deve ser enviado para o GitHub.
- A pasta `.next` e `node_modules` também não devem ser versionadas.
- Para atualizar conteúdos fixos do site, edite `data/site.ts`.
- Para atualizar projetos manualmente, edite `data/portfolio.json`.
- Para imagens persistentes em produção, use Cloudflare R2 ou Cloudflare Images.

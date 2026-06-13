# MKTECH Website

Website institucional da MKTECH desenvolvido com Next.js, React e TypeScript.

O projeto inclui a pagina publica da empresa, formulario de contacto por email, secao de portfolio gerida por dados JSON e uma area administrativa simples para criar, editar e remover projetos do portfolio.

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- Nodemailer para envio de emails
- Cloudflare R2 ou Cloudflare Images para upload de imagens do portfolio
- AWS SDK S3 Client para integracao com R2

## Estrutura principal

```text
app/
  page.tsx                  Pagina inicial
  layout.tsx                Layout global
  admin/page.tsx            Area administrativa
  api/contact/route.ts      Endpoint do formulario de contacto
  api/portfolio/route.ts    Endpoint publico do portfolio
  api/admin/*               Endpoints protegidos do admin

components/home/
  HomePage.tsx              Composicao da pagina inicial
  Header.tsx                Navegacao
  Hero.tsx                  Seccao inicial
  About.tsx                 Sobre a empresa
  Services.tsx              Servicos
  Portfolio.tsx             Portfolio
  Clients.tsx               Clientes
  Team.tsx                  Equipa
  Contact.tsx               Formulario de contacto
  Footer.tsx                Rodape

data/
  site.ts                   Conteudo principal do website
  portfolio.json            Projetos exibidos no portfolio

lib/
  adminAuth.ts              Login e sessao do admin
  portfolioStore.ts         Leitura, escrita e upload de imagens do portfolio

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

Gera a versao de producao.

```powershell
npm run start
```

Executa a versao de producao depois do build.

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

PORTFOLIO_UPLOAD_PROVIDER="r2"
PORTFOLIO_DATA_KEY="data/portfolio.json"

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

## Portfolio

Os projetos do portfolio ficam em:

```text
data/portfolio.json
```

Em desenvolvimento local, o projeto pode ler e escrever nesse ficheiro. Em producao no Vercel, o sistema de ficheiros e somente leitura, por isso as alteracoes feitas no admin devem ser guardadas no Cloudflare R2.

A chave usada para guardar o JSON no R2 e definida por:

```env
PORTFOLIO_DATA_KEY="data/portfolio.json"
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

Para deploy no Vercel, use Cloudflare R2 para guardar o JSON do portfolio e Cloudflare R2 ou Cloudflare Images para guardar as imagens, porque escrita local em producao nao e persistente.

## Area administrativa

A area administrativa esta disponivel em:

```text
/admin
```

O login e a sessao sao controlados em:

```text
lib/adminAuth.ts
```

Antes de colocar o projeto em producao, altere as credenciais do admin e, idealmente, mova-as para variaveis de ambiente.

## Deploy no Vercel

1. Enviar o projeto para um repositorio GitHub.
2. Entrar no Vercel e escolher `Add New Project`.
3. Importar o repositorio.
4. Confirmar que o framework detectado e `Next.js`.
5. Adicionar as variaveis de ambiente.
6. Fazer deploy.

Configuracao recomendada:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: default
```

## Observacoes importantes

- O ficheiro `.env` nao deve ser enviado para o GitHub.
- A pasta `.next` e `node_modules` tambem nao devem ser versionadas.
- Para atualizar conteudos fixos do site, edite `data/site.ts`.
- Para atualizar projetos manualmente, edite `data/portfolio.json`.
- Para imagens persistentes em producao, use Cloudflare R2 ou Cloudflare Images.

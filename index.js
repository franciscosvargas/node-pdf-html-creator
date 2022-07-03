var fs = require('fs');
const puppeteer= require('puppeteer')
const html = fs.readFileSync('./templates/RELATORIO_RECEITA_MENSAL.hbs', 'utf8');

const Handlebars = require('handlebars');

const data = {
  mesReferencia: 'Julho',
  anoReferencia: '2022',
  reportTitle: 'Relatório Mensal de Receita Estimada'
}

const template = Handlebars.compile(html)(data)

async function render() {
  const browser = await puppeteer.launch({
    args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage"
    ],
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(`data: text/html, ${template}`, { 
    waitUntil: "networkidle0" 
  });
  
  await page.setContent(template);
	await page.addStyleTag({ path: `${__dirname}/templates/common-styles.css`});

  const pdf = await page.pdf({ 
    format: 'A4', 
    printBackground: true,
    margin: '0px',

  });

  await fs.writeFileSync('RELATORIO_RECEITA_MENSAL.pdf', pdf);


  await browser.close();
}

render()


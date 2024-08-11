import path from 'path';
import fs from 'fs';
import ejs from 'ejs';

// Fungsi untuk merender template EJS
async function renderTemplate(
  templatePath: string,
  context: any
): Promise<string> {
  const template = fs.readFileSync(
    path.join(process.cwd(), templatePath),
    'utf8'
  );
  return ejs.render(template, context, {
    filename: path.join(process.cwd(), templatePath),
  });
}

export { renderTemplate };

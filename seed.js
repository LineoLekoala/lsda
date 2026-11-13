// Loads the six starter courses and an admin account. Run once: npm run seed
// NOTE: Sesotho text below is a first draft for titles/descriptions. Have a fluent Sesotho speaker
// review it and fill in the *_so fields for lessons and questions (the site falls back to English).
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const L = (title_en, title_so, body_en) => ({ title_en, title_so, body_en });
const Q = (text_en, options, correct) => ({ text_en, options, correct });

const courses = [
  {
    title_en: 'Smartphone and Mobile Applications', title_so: 'Mohala o Bohlale le Li-App',
    description_en: 'Learn to use your smartphone with confidence: settings, WhatsApp, email, apps and staying safe from scams.',
    description_so: 'Ithute ho sebelisa mohala oa hau o bohlale ka kholiseho: litlhophiso, WhatsApp, imeile, li-app le ho qoba bomenemene.',
    lessons: [
      L('Finding your way around your phone', 'Ho tseba mohala oa hau',
        'Your phone has a home screen, a settings app and a place where apps are kept.\n\n- Tap the gear icon to open Settings.\n- In Settings you can change the language, the screen brightness and the volume.\n- Turn on Wi-Fi only when you are near a network you trust.\n\nTip: if your battery is low, turn on Battery Saver in Settings.'),
      L('Using WhatsApp', 'Ho sebelisa WhatsApp',
        'WhatsApp lets you send messages, photos and voice notes using mobile data or Wi-Fi.\n\n- Open WhatsApp and tap the green message icon to start a chat.\n- Type your message and press the send arrow.\n- Hold the microphone button to record a voice note.\n\nMessages use very little data. Photos and videos use much more.'),
      L('Downloading apps and avoiding scams', 'Ho kopitsa li-app le ho qoba bomenemene',
        'Only download apps from the official store on your phone (Play Store or App Store).\n\n- Never share your PIN or one-time password (OTP) with anyone, even if they say they are from your bank.\n- Do not click links in messages from people you do not know.\n- If an offer sounds too good to be true, it is probably a scam.')
    ],
    questions: [
      Q('Where should you download apps from?', ['Links sent on WhatsApp', 'The official app store on your phone', 'Any website', 'A stranger'], 1),
      Q('Someone calls and asks for your one-time password (OTP). What should you do?', ['Give it to them quickly', 'Share it only if they say they are from the bank', 'Never share it with anyone', 'Send it by SMS'], 2),
      Q('Which uses the MOST mobile data?', ['A short text message', 'A voice note of 5 seconds', 'A long video', 'A typed emoji'], 2),
      Q('Where do you change your phone language and brightness?', ['Settings', 'Camera', 'Calculator', 'Contacts'], 0)
    ]
  },
  {
    title_en: 'Basic Computer Skills', title_so: 'Lintho Tsa Mantlha Tsa Khomphuta',
    description_en: 'Start from zero: the keyboard and mouse, files and folders, the internet and email.',
    description_so: 'Qala ho tloha ntlheng: keyboard le mouse, lifaele le lifoldara, inthanete le imeile.',
    lessons: [
      L('Meeting the computer', 'Ho tseba khomphuta',
        'A computer has a screen, a keyboard, a mouse and the main box (or the whole laptop).\n\n- Press the power button once to switch on.\n- Move the mouse to move the pointer on the screen.\n- Click the left button once to select, twice quickly to open.\n\nAlways shut down from the Start menu before you switch off.'),
      L('Files and folders', 'Lifaele le lifoldara',
        'A file is a single document, picture or song. A folder is a container that holds files.\n\n- Right-click on an empty space and choose New, then Folder.\n- Give the folder a clear name such as CV Documents.\n- Drag a file into the folder to keep your work organised.\n\nSave your work often so you do not lose it.'),
      L('Using the internet and email', 'Ho sebelisa inthanete le imeile',
        'A web browser (like Chrome) lets you visit websites. Type the address at the top, or type what you want into a search engine.\n\n- An email address looks like name@example.com.\n- To send email: click Compose, type the address, a subject and your message, then click Send.\n- Attach a file with the paperclip icon.')
    ],
    questions: [
      Q('What is a folder?', ['A type of virus', 'A container that holds files', 'A kind of printer', 'A website'], 1),
      Q('How do you open a file or folder with the mouse?', ['Click once with the right button', 'Double-click with the left button', 'Hold the keyboard', 'Press power'], 1),
      Q('Which is a correct email address?', ['name.example.com', 'name@example.com', 'name@@com', 'www.name'], 1),
      Q('How should you switch off a computer?', ['Pull out the plug', 'Use Shut down in the Start menu', 'Close the lid only', 'Hold the mouse'], 1)
    ]
  },
  {
    title_en: 'Microsoft Office Skills', title_so: 'Mahlale a Microsoft Office',
    description_en: 'Type a CV in Word, make a simple budget in Excel and build a presentation in PowerPoint.',
    description_so: 'Thaepa CV ho Word, etsa tekanyetso ea chelete ho Excel mme u hahe pontšo ho PowerPoint.',
    lessons: [
      L('Word: typing a CV or letter', 'Word: ho thaepa CV kapa lengolo',
        'Microsoft Word is used to write letters, CVs and reports.\n\n- Use a clear font such as Arial or Calibri, size 11 or 12.\n- Use Bold for headings like Education and Experience.\n- Press Ctrl+S to save your document often.\n- Use File, then Print, to print it.'),
      L('Excel: a simple budget', 'Excel: tekanyetso e bonolo ea chelete',
        'Excel is a grid of rows and columns. Each box is called a cell.\n\n- Type your income in one cell and each expense in the cells below it.\n- To add numbers, type =SUM( then select the cells and press Enter.\n- A formula always starts with the equals sign (=).\n\nExample: =B2-B3 subtracts the value in B3 from B2.'),
      L('PowerPoint: making a presentation', 'PowerPoint: ho etsa pontšo',
        'PowerPoint helps you show ideas on slides.\n\n- Keep each slide simple: a short heading and a few points.\n- Use large text so people at the back can read it.\n- Add a picture with Insert, then Pictures.\n- Press F5 to start the slide show.')
    ],
    questions: [
      Q('Which keys save your document?', ['Ctrl+S', 'Ctrl+P', 'Alt+F4', 'Shift+Z'], 0),
      Q('What must every Excel formula start with?', ['A plus sign', 'A hash sign', 'An equals sign (=)', 'A dollar sign'], 2),
      Q('Which program is best for typing a CV?', ['Excel', 'Word', 'Calculator', 'Paint'], 1),
      Q('Which key starts a PowerPoint slide show?', ['F5', 'F1', 'Esc', 'Tab'], 0)
    ]
  },
  {
    title_en: 'Introduction to Website Development', title_so: 'Selelekela sa ho Haha Liwebsaete',
    description_en: 'Learn what a website is and build a simple personal web page with HTML and CSS.',
    description_so: 'Ithute hore webosaete ke eng mme u hahe leqephe le bonolo la hau ka HTML le CSS.',
    lessons: [
      L('What is a website?', 'Webosaete ke eng?',
        'A website is a group of pages stored on a computer called a server, which you can open with a browser.\n\n- Every website has an address, for example www.example.com.\n- Pages are written in a language called HTML.\n- A style language called CSS controls colours and layout.'),
      L('Your first HTML page', 'Leqephe la hau la pele la HTML',
        'HTML uses tags. A tag is written inside angle brackets.\n\n- <h1>My Name</h1> makes a big heading.\n- <p>I am learning.</p> makes a paragraph.\n- <img src="photo.jpg"> adds a picture.\n- <a href="https://example.com">Click here</a> makes a link.\n\nSave the file as index.html and double-click it to open it in your browser.'),
      L('Adding style with CSS', 'Ho eketsa mokhoa ka CSS',
        'CSS changes how your page looks.\n\n- h1 { color: blue; } makes all headings blue.\n- p { font-size: 18px; } makes paragraph text bigger.\n- body { background: white; } sets the page colour.\n\nTo publish for free, you can use a service such as GitHub Pages.')
    ],
    questions: [
      Q('What does HTML do?', ['It sends email', 'It describes the content of a web page', 'It cleans the computer', 'It stores passwords'], 1),
      Q('Which tag makes a big heading?', ['<p>', '<h1>', '<a>', '<img>'], 1),
      Q('What does CSS control?', ['Colours and layout', 'Internet speed', 'Battery', 'Email'], 0),
      Q('What file name is usually used for the main page of a website?', ['main.exe', 'index.html', 'page.doc', 'home.mp3'], 1)
    ]
  },
  {
    title_en: 'Online Job Applications', title_so: 'Ho Kopa Mesebetsi ka Inthanete',
    description_en: 'Search for jobs online, write a strong CV and application letter, apply online and spot fake job adverts.',
    description_so: 'Batla mesebetsi ka inthanete, ngola CV le lengolo la kopo, kopa mosebetsi ka inthanete mme u tsebe ho khetholla litsebiso tsa mesebetsi tsa bohata.',
    lessons: [
      L('Searching for jobs online', 'Ho batla mesebetsi ka inthanete',
        'Jobs are advertised on company websites, government sites, newspapers online and social media groups.\n\n- Use search words like "jobs Maseru" or "internship Lesotho".\n- Read the closing date and the requirements carefully.\n- Save the advert so you can refer to it later.'),
      L('Your CV and application letter', 'CV ea hau le lengolo la kopo',
        'A good CV is one or two pages long.\n\n- Put your name, phone number and email at the top.\n- List your education and work or volunteer experience, newest first.\n- Add two referees who agreed to support you.\n- Your letter should say which job you want and why you are suitable. Keep it to one page.'),
      L('Applying online and spotting fake adverts', 'Ho kopa ka inthanete le ho tseba litsebiso tsa bohata',
        'Many employers ask you to email your documents or use an online form.\n\n- Save documents as PDF so the layout does not change.\n- Name files clearly, for example Thabo_Mokoena_CV.pdf.\n- A real employer will never ask you to pay money to get a job or an interview.\n- Be careful of adverts that promise very high pay for no experience.')
    ],
    questions: [
      Q('A person says you must pay a fee to get the job. What should you do?', ['Pay quickly', 'Treat it as a likely scam', 'Pay half', 'Send your PIN'], 1),
      Q('Which file type keeps your CV layout the same on any device?', ['PDF', 'MP3', 'EXE', 'ZIP only'], 0),
      Q('How long should a good CV usually be?', ['One or two pages', 'Ten pages', 'Half a line', 'Five pages'], 0),
      Q('What should you check first in a job advert?', ['The closing date and requirements', 'The font', 'The colour', 'The picture'], 0)
    ]
  },
  {
    title_en: 'Digital Safety and Online Services', title_so: 'Polokeho ea Dijithale le Litšebeletso tsa Inthanete',
    description_en: 'Create strong passwords, protect your personal information, recognise fraud and use online services and mobile money safely.',
    description_so: 'Etsa lipasewete tse matla, sireletsa lintlha tsa hau, tseba bomenemene mme u sebelise litšebeletso tsa inthanete le chelete ea mohala ka polokeho.',
    lessons: [
      L('Strong passwords', 'Lipasewete tse matla',
        'A strong password is long and hard to guess.\n\n- Use at least 10 characters with letters, numbers and symbols.\n- Do not use your name, birthday or 123456.\n- Use a different password for each important account.\n- Never tell anyone your passwords.'),
      L('Protecting your personal information', 'Ho sireletsa lintlha tsa hau',
        'Your ID number, bank details and PIN are private.\n\n- Think before you post photos, your address or your phone number on social media.\n- Log out of accounts on shared phones and computers.\n- Turn on two-step verification when it is offered.'),
      L('Recognising fraud and using mobile money safely', 'Ho tseba bomenemene le ho sebelisa chelete ea mohala ka polokeho',
        'Fraudsters pretend to be banks, mobile money agents or winners of a prize.\n\n- Real companies never ask for your PIN.\n- Do not send money to claim a prize.\n- Check the name and number before you confirm a mobile money payment.\n- If you are not sure, stop and ask someone you trust or call the company on its official number.')
    ],
    questions: [
      Q('Which password is the strongest?', ['123456', 'thabo', 'T7!river#Lesotho29', 'password'], 2),
      Q('Who should you share your PIN with?', ['Your bank agent', 'A friend', 'Nobody', 'The caller'], 2),
      Q('A message says you won a prize but must send money first. This is:', ['A real prize', 'A likely scam', 'A bank rule', 'A free gift'], 1),
      Q('What should you do on a shared computer after using your email?', ['Leave it open', 'Log out', 'Write your password on the screen', 'Nothing'], 1)
    ]
  }
];

(async () => {
  const [[{ n }]] = await db.query('SELECT COUNT(*) n FROM courses');
  if (n > 0) { console.log('Courses already exist. Skipping course seed.'); }
  else {
    let moduleNo = 1;
    for (const c of courses) {
      const [r] = await db.query(
        'INSERT INTO courses (module_no, title_en, title_so, description_en, description_so) VALUES (?,?,?,?,?)',
        [moduleNo++, c.title_en, c.title_so, c.description_en, c.description_so]);
      let pos = 1;
      for (const l of c.lessons)
        await db.query('INSERT INTO lessons (course_id, position, title_en, title_so, body_en) VALUES (?,?,?,?,?)',
          [r.insertId, pos++, l.title_en, l.title_so, l.body_en]);
      const [qz] = await db.query('INSERT INTO quizzes (course_id, pass_mark) VALUES (?,70)', [r.insertId]);
      for (const q of c.questions)
        await db.query('INSERT INTO questions (quiz_id, text_en, options_en, correct_index) VALUES (?,?,?,?)',
          [qz.insertId, q.text_en, JSON.stringify(q.options), q.correct]);
    }
    console.log(`Seeded ${courses.length} courses.`);
  }

  const id = (process.env.ADMIN_IDENTIFIER || 'admin@lsda.local').toLowerCase();
  const [ex] = await db.query('SELECT id FROM users WHERE identifier=?', [id]);
  if (!ex.length) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMe123', 10);
    await db.query("INSERT INTO users (full_name, identifier, password_hash, role, consent_at) VALUES ('Academy Administrator',?,?,'admin',NOW())", [id, hash]);
    console.log('Admin account created:', id);
  }
  await db.end();
})().catch(e => { console.error(e.message); process.exit(1); });

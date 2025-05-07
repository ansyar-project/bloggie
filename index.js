import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

let title = '';
let content = '';
let writerName = '';
let imagePath = '';

setInterval(() => {
    title = '';
    content = '';
    console.log('Title and content reset');
  }, 5 * 60 * 1000); // 1 minutes

// Set up multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const customName = `image${ext}`; // Custom name for the file
        cb(null, customName);
    }
  });

// File filter to accept only PNG files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true); // Accept PNG files
    } else {
      cb(null, false); // Reject non-PNG files
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.render('index', { success: false, error: null });
    }  );

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.get('/view-post', (req, res) => {
    res.render('view-post', { title: title, content: content, imagePath: imagePath, writerName: writerName });
});

app.post('/submit', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.render('index', { success: false, error: 'Please upload a PNG image.' });
    }
    imagePath = `/uploads/image.png`; // Store the path to the uploaded image
    title = req.body.title;
    content = req.body.content;
    writerName = req.body.writerName;
    res.render('index', { success: true, error: null});
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Endpoint to handle requests to glot.io's run API
app.post('/runcode', async (req, res) => {
    try {
        const { token, language, fileName, code, stdin } = req.body;

        const glotResponse = await axios.post(`https://glot.io/api/run/${language}/latest`, {
            stdin,
            files: [{
                name: fileName,
                content: code
            }]
        }, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-type': 'application/json'
            }
        });

        res.json(glotResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

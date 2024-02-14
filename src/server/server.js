const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require("dotenv").config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BASE_ID = 'app7qupBwSPEY7HaZ';
const QUIZ_TABLE = 'tbl8AT5sxaS6nhPvL';
const QA_TABLE = 'tbl10G10gJIPyUwRo';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('BACKEND');
});

app.get('/api/airtable-quiz', async (req, res) => {
    try {
        let allRecords = [];
        let offset = null;
        while (true) {
            const response = await axios.get(
                `https://api.airtable.com/v0/${BASE_ID}/${QUIZ_TABLE}`,
                {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                },
                params: {
                    pageSize: 100,
                    offset: offset,
                },
                }
            );
            const records = response.data.records;
            allRecords = allRecords.concat(records);
            if (response.data.offset) {
                offset = response.data.offset;
            } else {
                break;
            }
        }
        res.json(allRecords);
    } catch (error) {
        console.error('Error fetching records from Airtable:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/airtable-qa', async (req, res) => {
    try {
        let allRecords = [];
        let offset = null;
        while (true) {
            const response = await axios.get(
                `https://api.airtable.com/v0/${BASE_ID}/${QA_TABLE}`,
                {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                },
                params: {
                    pageSize: 100,
                    offset: offset,
                },
                }
            );
            const records = response.data.records;
            allRecords = allRecords.concat(records);
            if (response.data.offset) {
                offset = response.data.offset;
            } else {
                break;
            }
        }
        res.json(allRecords);
    } catch (error) {
        console.error('Error fetching records from Airtable:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/chat-airtable', async (req, res) => {
    try {
        const apiUrl = `https://api.airtable.com/v0/${BASE_ID}/${QA_TABLE}`;
        const airtableData = {
            fields: {
                'Question ID': req.body.questionId,
                'Airtable ID': req.body.airtableId,
                'Type': req.body.type,
                'Question': req.body.question,
                'Choices': JSON.stringify(req.body.choices),
                'Answer': req.body.answer,
                'Estimated Time': req.body.estimatedTime,
            },
        };
        const response = await axios.post(apiUrl, airtableData, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Airtable Error:', error);
        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: req.body.messages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
  
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
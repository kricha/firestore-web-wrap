import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import bodyParser from 'body-parser';
import creds from '../firestore.json' assert { type: 'json' };

import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import moment from 'moment-timezone';

const app = new App();
initializeApp({ credential: cert(creds) });

const firestore = getFirestore();

app
    .use(logger())
    .use(bodyParser.json())
    .post('/trackAction', (req, res) => {
        const { username, ip, data, type } = req.body;
        const now = moment().tz('Europe/Kyiv');
        firestore.doc(`login/${username}`).set({ [`action_${now.format('MM-DD-YY')}`]: { [`${now.format('HH:mm:ss')}`]: [ip, type, data] } }, { merge: true }).then(()=>{
            res.json({ok: true});
        })
    })
    .post('/trackSerf', (req, res) => {
        const { username, ip, method, url } = req.body;
        const now = moment().tz('Europe/Kyiv');
        firestore.doc(`login/${username}`).set({ [`serf_${now.format('MM-DD-YY')}`]: { [`${now.format('HH:mm:ss')}`]: [ip, method, url] } }, { merge: true }).then(()=>{
            res.json({ok: true});
        })
    })
    .post('/trackLogin', (req, res) => {
        const { username, ip } = req.body;
        const now = moment().tz('Europe/Kyiv');
        firestore.doc(`login/${username}`).set({ [`${now.format('MM-DD-YY HH:mm:ss')}`]: ip }, { merge: true }).then(()=>{
            res.json({ok: true});
        })
    })
    
    .listen(5555)
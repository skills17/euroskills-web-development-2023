import {Express, json, Request, Response} from 'express';
import cors from "cors";
import multer from "multer";
import loginController from './controllers/frontend/login';
import logoutController from './controllers/frontend/logout';
import workspaceController from './controllers/frontend/workspace';
import apiTokensController from './controllers/frontend/apiTokens';
import billingQuotasController from './controllers/frontend/billingQuotas';
import billsController from './controllers/frontend/bills';
import apiChatController from './controllers/api/chat';
import apiImageGenerationController from './controllers/api/imageGeneration';
import apiImageRecognitionController from './controllers/api/imageRecognition';
import fileController from './controllers/files';
import {tokenAuth, userAuth} from './middlewares/authentication';
import validWorkspace from './middlewares/validWorkspace';
import {notFound} from './utils/views';
import {unless} from "./utils/route";
import quotaCheck from "./middlewares/quota";


export const setupRoutes = (app: Express) => {
    const upload = multer({dest: 'uploads/'});

    // api
    app.use('/api', cors());
    app.use('/api', json());
    app.use('/api', tokenAuth);
    app.use('/api', quotaCheck);
    app.post('/api/chat/conversation', apiChatController.startConversation);
    app.put('/api/chat/conversation/:conversationId', apiChatController.continueConversation);
    app.get('/api/chat/conversation/:conversationId', apiChatController.getResponse);

    app.post('/api/imagegeneration/generate', apiImageGenerationController.generate);
    app.get('/api/imagegeneration/status/:jobId', apiImageGenerationController.getJobStatus);
    app.get('/api/imagegeneration/result/:jobId', apiImageGenerationController.getResult);
    app.post('/api/imagegeneration/upscale', apiImageGenerationController.upscale);
    app.post('/api/imagegeneration/zoom/in', apiImageGenerationController.zoomIn);
    app.post('/api/imagegeneration/zoom/out', apiImageGenerationController.zoomOut);

    app.post('/api/imagerecognition/recognize', upload.single('image'), apiImageRecognitionController.recognize);

    // views
    app.use(unless(['/api', '/files'], userAuth));

    app.get('/login', loginController.get);
    app.post('/login', loginController.post);
    app.get('/logout', logoutController.get);

    app.get('/workspaces', workspaceController.index);
    app.get('/workspaces/create', workspaceController.create);
    app.post('/workspaces/create', workspaceController.store);

    app.use('/workspaces/:workspaceId', validWorkspace);

    app.get('/workspaces/:workspaceId', workspaceController.show);
    app.get('/workspaces/:workspaceId/edit', workspaceController.edit);
    app.post('/workspaces/:workspaceId/edit', workspaceController.update);
    app.get('/workspaces/:workspaceId/tokens/create', apiTokensController.create);
    app.post('/workspaces/:workspaceId/tokens/create', apiTokensController.store);
    app.post('/workspaces/:workspaceId/tokens/:tokenId/revoke', apiTokensController.destroy);
    app.get('/workspaces/:workspaceId/quota', billingQuotasController.edit);
    app.post('/workspaces/:workspaceId/quota', billingQuotasController.update);
    app.get('/workspaces/:workspaceId/bills/:year/:month', billsController.show);

    app.get('/', (req: Request, res: Response) => res.redirect('/workspaces'));

    // files
    app.get('/files/*', fileController.file)

    // 404
    app.get('*', (req: Request, res: Response) => notFound(res));
};

import { Router } from 'express';
import { showFormRegister, loginUser, registerUser,showDashboard,logout,showFormLogin,showRecovery,
    showPrincipal,recoveryHandler
} from '../controllers/usersSQLServer.js';

const router = Router();

router.get('/registro', showFormRegister);
router.get('/dashboard',showDashboard);
router.get('/logout',logout);
router.get('/login',showFormLogin);
router.get('/principal',showPrincipal);


router.post('/registro', registerUser);
router.post('/login', loginUser);

router.get('/recuperar', (req, res) => {
  res.render('pages/recuperar', {
    correo: '',
    pregunta: '',
    error: null
  });
});

router.post('/recuperar', recoveryHandler);

export default router;  
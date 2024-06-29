const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require('./db');

// Definição da estratégia local
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        // Consulta ao banco de dados para verificar o email
        connection.query('SELECT id, email, password FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                return done(err);
            }
            if (results.length === 0) {
                return done(null, false, { message: 'Email not found' });
            }

            const user = results[0];

            // Comparação da senha fornecida com a senha armazenada no banco de dados
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        });
    }
));

// Serialização do usuário (armazenando o ID na sessão)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Desserialização do usuário (recuperando os dados do usuário a partir do ID)
passport.deserializeUser((id, done) => {
    connection.query('SELECT id, email FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            return done(err);
        }
        done(null, results[0]);
    });
});

module.exports = passport;

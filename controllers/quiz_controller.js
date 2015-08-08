var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};
// GET /quizes
// buscador https://github.com/dpramar/quiz-miriadax
exports.index = function(req, res) {
  search = req.query.search;
  if(search) {
    search = '%' + search.replace(/\s/g,"%") +'%';
    models.Quiz.findAll({where: ["pregunta LIKE ?",search], order: 'pregunta ASC'}).then(function(quizes){
      res.render('quizes/index', {quizes: quizes, errors: []});  
    })
    .catch(function(error) {next(error);});
  } else {
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index', {quizes: quizes, errors: []});  
    })
    .catch(function(error) {next(error);});
  }
};



// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build(// crea objeto quiz
      {pregunta:"Pregunta", respuesta:"Respuesta"}
    );
  res.render('quizes/new', {quiz:quiz});
}

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};
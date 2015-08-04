var models = require('../models/models.js');

var statistics={npreguntas: 0,
		ncomentarios: 0,
		commentariosSinPublicar: 0,
		preguntasComentadas: 0
		};
var errors = [];


exports.calculate = function(req, res, next) {
	

        models.Quiz.count()
	.then(function (numPreguntas) {
	statistics.npreguntas = numPreguntas;
	return models.Comment.count();
	})
	.then(function (numComentarios) { // número de comentarios
	statistics.ncomentarios = numComentarios;
	return models.Comment.countUnpublished();
	})
	.then(function (numSinPublicar) { // número de comentarios sin publicar
	   statistics.comentariosSinPublicar = numSinPublicar;
	   return models.Comment.countCommentedQuizes();
	})
	.then(function (numComentadas) { // número de preguntas con comentario
	    statistics.preguntasComentadas = numComentadas;
	})
	.catch(function (err) { errors.push(err); })
	.finally(function () {
	    next();
	});
};

// GET /quizes/statistics
exports.show = function (req, res) {
  res.render('quizes/statistics.ejs', { statistics: statistics, errors: errors });
};


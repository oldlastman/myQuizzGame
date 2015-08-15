var models = require('../models/models.js');
// basado en https://github.com/jafs/quiz-miriadax/blob/17cc885f4dae6dd08b62cd3e4e9b091399ccbce0/controllers/statistics_controller.js
exports.show = function(req, res, next) {
    var datos = new Array();
        datos['pregTotal']             = 0
        datos['comentariosTotal']      = 0,
        datos['comentariosMedia']      = 0,
        datos['pregSinComentarios']    = 0,
        datos['pregConComentarios']    = 0;
        datos['ComentariosSinAprobar'] = 0;
                

    return models.Quiz.count(
    ).then(function(pregTotal){
        datos['pregTotal'] = pregTotal;
        return models.Comment.count();
    }).then(function(comentariosTotal){
        
        datos['comentariosTotal'] = comentariosTotal;

        return models.Comment.count({
                where : {publicado: true}
            });
    }).then(function(ComentariosSinAprobar){
        
        datos['ComentariosSinAprobar'] = ComentariosSinAprobar;

        return models.Quiz.findAll({
            include: [{
                model: models.Comment
            }]});
    }).then(function(quizes){

        for (var i in quizes) {
            if (quizes[i].Comments.length) {
                ++datos['pregConComentarios'];
            } 
        }

        datos['pregSinComentarios'] = datos['pregTotal'] - datos['pregConComentarios'];  
            
            
            if(datos['comentariosTotal']>0)
                datos['comentariosMedia']  = datos['comentariosTotal']/datos['pregTotal'];
            
            res.render('statistics/show.ejs', {
                datos: datos
            });
    }).catch(function(error){next(error)});




};
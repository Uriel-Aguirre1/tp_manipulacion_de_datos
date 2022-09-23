      
        const path = require('path');
        const moment = require('moment');
        const methodOverride = require('method-override');
        const db = require('../database/models');
        const sequelize = db.sequelize;
        const { Op } = require("sequelize");
        
        
        //Aqui tienen una forma de llamar a cada uno de los modelos
        // const {Movies,Genres,Actor} = require('../database/models');
        
        //Aquí tienen otra forma de llamar a los modelos creados
        const Movies = db.Movie;
        const Genres = db.Genre;
        const Actors = db.Actor;
        
        
        const moviesController = {
            'list': (req, res) => {
                db.Movie.findAll()
                    .then(movies => {
                        res.render('moviesList.ejs', {movies})
                    })
            },
            'detail': (req, res) => {
                db.Movie.findByPk(req.params.id)
                    .then(movie => {
                        res.render('moviesDetail.ejs', {movie});
                    });
            },
            'new': (req, res) => {
                db.Movie.findAll({
                    order : [
                        ['release_date', 'DESC']
                    ],
                    limit: 5
                })
                    .then(movies => {
                        res.render('newestMovies', {movies});
                    });
            },
            'recomended': (req, res) => {
                db.Movie.findAll({
                    where: {
                        rating: {[db.Sequelize.Op.gte] : 8}
                    },
                    order: [
                        ['rating', 'DESC']
                    ]
                })
                    .then(movies => {
                        res.render('recommendedMovies.ejs', {movies});
                    });
            },    
    add: function (req, res) {
        // TODO  
        db.Genre.findAll({
            order : ['name']
        })
        .then(genres => res.render('moviesAdd', {genres}))
        .catch(error => console.log(error))
    },
    create: function (req, res) {
        // TODO
        const {title, release_date, awards, length,rating, genre} = req.body;
        db.Movie.create({
            title: title.trim(),
            rating,
            length,
            awards,
            release_date,
            genre
        }).then(movie => {
            console.log(movie)
            return res.redirect('/movies')
        }).catch(error => console.log(error))
    },
    edit: function(req, res) {
        // TODO
        let Movie = Movies.findByPk(req.params.id);
        let allGenres = Genres.findAll({
            order : ['name']
        });

        Promise.all([Movie, allGenres])
        .then(([Movie,allGenres])=>{
            return res.render('moviesEdit',{
                Movie,
                allGenres,
                moment : moment
            })
        })
        .catch(error => console.log(error))
    },
    update: function (req,res) {
        // TODO
        const {title, release_date, awards, length,rating,} = req.body;
        Movies.update(
            {
            title: title.trim(),
            rating,
            length,
            awards,
            release_date,
            
        },
        {
            where : {
                id : req.params.id
            }
        }
        )
        .then( () => res.redirect('/movies/detail/'+ req.params.id))
        .catch(error => console.log(error))
        },
    delete: function (req, res) {
        // TODO
        const Movie = req.query
        return res.render('moviesDelete',{Movie})
    },
    destroy: function (req, res) {
        // TODO
        const {id} = req.params
        Movies.destroy({where:{id}})
        .then(()=>{
            return res.redirect('/movies')
        })
        .catch(err=> {console.log(err)})
    }

}

module.exports = moviesController;
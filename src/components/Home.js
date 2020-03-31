import React, {useState} from 'react';
import fetchJsonp from 'fetch-jsonp';
import Track from "./Track";
import FavService from '../FavService';

function Home(props) {

    const [title, setTitle] = useState('');
    const [orderBy, setOrderBy] = useState('ALBUM_ASC');
    const [musics, setMusics] = useState([]);

    function Changeval(event){
        setTitle(event.target.value); /// On remplace (on la set) la variable title par la value de l'event
    }
    function Changeoption(event){
        setOrderBy(event.target.value);
    }
    function onSearch(event){
        event.preventDefault(); // Empêche le navigateur de recharger la page

        const encodedTitle = encodeURIComponent(title);  /// permet d'encoder un composant d'un Uniform Resource Identifier (URI) en remplaçant chaque exemplaire de certains caractères par une, deux, trois ou quatres séquences d'échappement UTF-8 correspondantes

        fetchJsonp(
            `https://api.deezer.com/search?q=${encodedTitle}&order=${orderBy}&output=jsonp`
        )
            .then(res => res.json())
            .then(data => data.data)
            .then(musics => {
                    console.log(musics);
                setMusics(musics);
            });

    }

    function onFavorites(music) {
        FavService.toggleFavorite(music);
        setMusics([...musics]);
    }

    return (
        <div><main className="container mt-3">
            <h1>Recherche</h1>
            <p>Recherchez un titre sur Deezer en utilisant le formulaire suivant :</p>
            <hr/>
            <form onSubmit={onSearch}>
                <div className="row">
                    <label htmlFor="searchText" className="col-sm-2 col-form-label text-right">Titre&nbsp;:</label>
                    <div className="col-sm-4">
                        <input onChange={Changeval} type="text" className="form-control" id="searchText"
                               placeholder="Eminem, Armin Van Buuren, Rihanna, ..."/>
                    </div>
                    <label htmlFor="searchText" className="col-sm-2 col-form-label text-right">Trier par :</label>
                    <div className="col-sm-2">
                        <select id="order" className="custom-select" onChange={Changeoption}>
                            <option value="ALBUM_ASC">Album</option>
                            <option value="ARTIST_ASC">Artiste</option>
                            <option value="TRACK_ASC">Musique</option>
                            <option value="RANKING">Les plus populaires</option>
                            <option value="RATING_ASC">Les mieux notés</option>
                        </select>
                    </div>
                    <div className="col-sm-2 text-right">
                        <input type="submit" className="btn btn-primary" value="Go"/>
                    </div>
                </div>
            </form>
            <hr/>
            {/* <h3>Aucun résultat pour cette recherche ...</h3> */}
            <h2>Résultats</h2>
            <div className="card-group search-results">
                {
                    musics.map(music => {
                        return (
                            <Track key={music.id} onNewFavorite={onFavorites} music={music} isFavorite={FavService.isFavorite(music)}  />
                        );
                    })

                }
            </div>
        </main></div>
    );
}

export default Home;
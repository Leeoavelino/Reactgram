import './Photo.css'

import { uploads } from '../../utils/config'

//components
import Message from "../../components/Message"
import {Link} from "react-router-dom"
import PhotoItem from '../../components/PhotoItem'

//hooks
import { useEffect, useState } from 'react'
import {useSelector, useDispatch} from "react-redux"
import { useParams } from 'react-router-dom'
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage'

//Redux
import { getPhoto, like, comment } from '../../slices/photoSlice'
import LikeContainer from '../../components/LikeContainer'

const Photo = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const resetMessage = useResetComponentMessage(dispatch)
    const {user} = useSelector((state) => state.auth)
    const {photo, loading, error, message} = useSelector((state) => state.photo)

    const [commentText, setCommentText] = useState("") //estado para o texto do comentario

    //carregar os dados da foto
    useEffect(() => {
        dispatch(getPhoto(id))
    }, [dispatch, id])

    //funçao para inserir likes
    const handleLike = () => {
        dispatch(like(photo._id))
        resetMessage()
    }

    //funçao para inserir comentarios
    const handleComment = (e) => {
        e.preventDefault() 

        const commentData = { //dados do comentario
            comment: commentText,
            id: photo._id
        }
        dispatch(comment(commentData)) //enviar os dados para o backend
        setCommentText("") //resetar o estado do texto do comentario
        resetMessage() //resetar as mensagens de erro e sucesso
    }

    if(loading){
        return <p>Carregando...</p>
    }

    return(
        <div id="photo">
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <div className="message-container">
                {error && <Message msg={error} type="error" />}
                {message && <Message msg={message} type="success" />}
            </div>
            <div className="comments">
                {photo.comments && (
                    <>
                        <h3>Comentários ({photo.comments && photo.comments.length })</h3>
                        <form onSubmit={handleComment}>
                            <input type="text" placeholder='Insira o seu comentario...' onChange={(e) => setCommentText(e.target.value)} value={commentText || ""} />
                            <input type="submit" value="Enviar" />
                        </form>
                        
                        {photo.comments.length === 0 && <p>Não há comentários...</p>}
                        {photo.comments.map((comment) => (
                            <div className="comment" key={comment.comment}>
                                <div className="author">
                                    {comment.userImage && (
                                        <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} />
                                    )}
                                    <Link to={`/users/${comment.userId}`}>
                                        <p>
                                            {comment.userName}
                                        </p>
                                    </Link>
                                </div>
                                <p>
                                    {comment.comment}
                                </p>
                            </div>
                        ))}
                    </>
                )}

            </div>

        </div>

    )
}

export default Photo
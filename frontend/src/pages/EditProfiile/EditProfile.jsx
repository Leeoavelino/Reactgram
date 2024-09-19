import "./EditProfile.css"

const EditProfile = () => {

    const handleSubmit = (e) => {
        e.prevemtDefault()
    }


    return(
        <div id="edit-profile">

            <h2>Edite seus dados</h2>

            <p className="subtitle">
                Adicione uma imagem de perfil e conte mais sobre você...
            </p>
            {/* aqui vai estar o preview da imagem */}

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome" />
                <input type="email" placeholder="E-mail" />
                <label>
                    <span>Imagem do Perfil:</span>
                    <input type="file"/>
                </label>
                <label>
                    <span>Bio:</span>
                    <input type="text" placeholder="Descrição do perfil"/>
                </label>
                <label>
                    <span>Quer alterar sua senha?</span>
                    <input type="password" placeholder="Digite sua nova senha" />
                </label>
                <input type="submit" value="Atualizar" />
            </form>
            
            
        </div>
    )
}

export default EditProfile
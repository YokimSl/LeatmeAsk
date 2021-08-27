import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import illustrationImg from '../assents/images/illustration.svg'
import logoImg from '../assents/images/logo.svg';

import { Button } from '../componets/Button';
import { database } from '../services/firebase';

import '../style/auth.scss';
import { useAuth } from '../hooks/useAuth';

export function NewRoom(){
const { user } = useAuth()
const history =useHistory()

const [newRoom, setNewRoom] = useState('');

async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    if (newRoom.trim() === '' ){
        return;
    }
    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
        title: newRoom,
        authorId: user?.id,
    })
    history.push(`/rooms/${firebaseRoom.key}`)

}

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="ilustração " />
                <strong>Crie salas  ao-vivo </strong>
                <p>Tire as Duvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="letmeask" />
                   <h2>Criar Uma Nova Sala</h2>
                    <form  onSubmit={handleCreateRoom}>
                    <input 
                    type="text"
                    placeholder="Nome da sala"
                    onChange={event => setNewRoom(event.target.value)}
                    value={newRoom}
                    />
                    <Button type="submit" >
                        Criar Sala 
                    </Button >

                    </form>
                    <p>Quer enrtar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>

        </div>
    );
}
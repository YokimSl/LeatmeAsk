import { useHistory } from 'react-router-dom'
import { FormEvent } from 'react';


import illustrationImg from '../assents/images/illustration.svg'
import logoImg from '../assents/images/logo.svg';
import googleIconImg from '../assents/images/google-icon.svg';
import { useState } from 'react';

import { Button } from '../componets/Button';


import '../style/auth.scss';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

export function Home(){
    const history =useHistory();
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState(''); 

    async function handleCreateRoom(){
        if (!user) {
           await signInWithGoogle()
        }

        history.push('/rooms/news')

    }

    async function handleJoinRoom(event :FormEvent){
        event.preventDefault();

        if (roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if (!roomRef.exists()){
            alert('Room does not exist.');
            return;
        }


        if (roomRef.val().endedAt){
            alert('Room already closed');
            return;
        }

        history.push(`/rooms/${roomCode}`);



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
                    <button onClick={handleCreateRoom} className="create">
                        <img src={googleIconImg} alt="logo do google" />
                        Crie Sua Sala com google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                    <input 
                    type="text"
                    placeholder="Digite o código da sala"
                    onChange={event => setRoomCode(event.target.value)}
                    value={roomCode}
                    />
                    <Button type="submit" >
                        Entrar na sala 
                    </Button >

                    </form>
                </div>
            </main>

        </div>
    );
}
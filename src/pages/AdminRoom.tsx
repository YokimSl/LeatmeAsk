import  { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assents/images/logo.svg'
import deleteImg from '../assents/images/delete.svg'
import checkImg from '../assents/images/check.svg'
import answerImg from '../assents/images/answer.svg'

import { Button } from '../componets/Button'
import { Question } from '../componets/Question';
import { RoomCode } from '../componets/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../style/room.scss';




type RoomParams ={
    id: string;
}

export function AdminRoom (){
   // const {user} = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { title, questions} = useRoom(roomId)

    async function handleEndRoom (){
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
       if (window.confirm('Tem certeza que deseja  excluir essa pergunta?')) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
       }
    }
    async function handleCheckQuestionAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }
    async function handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
    })
    }

    return(
        <div id="page-room">
            <header>
            <div className="content">
                <img src={logoImg}  alt="leatmeaks" />
            <div>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}> Encerrar Sala</Button>
            </div>
            </div>
            </header>


            <main> 
            <div className="room-title">
                <h1>Sala {title} </h1>
                { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
            </div>
        


       <div className="question-list">
       {questions.map(questions => {
                return (
                  <Question 
                  key={questions.id}
                  content={questions.content}
                  author={questions.author}
                  isAnswered={questions.isAnswered}
                  isHighlighted={questions.isHighlighted}
                  
                  > 
             
                    {!questions.isAnswered && (
                        <>
                                   <button
                                   type ="button"
                                   onClick={() => handleCheckQuestionAsAnswered(questions.id)}
                                   
                                   
                                   >
                                     <img src={checkImg} alt="marca pergunta como respodida pergunta"/>
                                   </button>
                                   <button
                                   type ="button"
                                   onClick={() =>  handleHighlightQuestion(questions.id)}
                                   
                                   
                                   >
                                     <img src={answerImg} alt="Dar destaque a  pergunta"/>
                                   </button>
                                   </>
                    )}

                  <button
                  type ="button"
                  onClick={() => handleDeleteQuestion(questions.id)}
                  
                  
                  >
                    <img src={deleteImg} alt="remover pergunta"/>
                  </button>
                  </Question>
                );
            })}
       </div>




            </main>
        </div>
    );
}
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import DraggableCard from "./DraggableCard";

interface IBoardWrapper{
    boardId:string,
    toDos:ITodo[]
}

interface IForm{
    toDo:string
}

const BoardWrapper=styled.div`
    padding-top:10px;
    background-color: ${props=>props.theme.boardColor};
    border-radius: 8px;
    min-height: 300px;
    display:flex;
    flex-direction: column;
`;

const Form=styled.form`
    width:100%;
    margin-bottom: 10px;
    input{
        width:100%;
        border: none;
        border-radius: 6px;
        height:25px;
    }
`;

const Area=styled.div<{isDraggingOver:Boolean,isDraggingFromThis:Boolean}>`
    height:100%;
    background-color: ${props=>props.isDraggingOver ? "#dfe6e9" : props.isDraggingFromThis ? "#b2bec3" : "transparent"};
`;

const Title=styled.h1`
    display: flex;
    justify-content: center;
    font-size:20px;
    font-weight: 500;
    margin-bottom:10px;
`

function Board({boardId,toDos}:IBoardWrapper){
    const setTodos=useSetRecoilState(toDoState);
    const {
        register,
        handleSubmit,
        setValue
    } = useForm<IForm>();
    const onValid=({toDo}:IForm)=>{
        const newTodo={
            id:Date.now(),
            text:toDo
        };
        setTodos(allBoards=>{
            return {
                ...allBoards,
                [boardId]:[
                    ...toDos,
                    newTodo
                ]
            }
        })
        setValue("toDo","");
    }
    return <BoardWrapper>
        <Title>{boardId}</Title>
        <Form onSubmit={handleSubmit(onValid)}>
            <input 
            {...register("toDo",{required:true})} 
            type="text" 
            placeholder={`Add task on ${boardId}`} />
        </Form>
        <Droppable droppableId={boardId}>
        {(provided, snapshot) =>
            <Area 
            isDraggingOver={snapshot.isDraggingOver} 
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef} 
            {...provided.droppableProps}>
                 {toDos.map((toDo,index)=>
                 <DraggableCard 
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                 />)}
                 {provided.placeholder}
            </Area>
        }
        </Droppable>
    </BoardWrapper>
}

export default Board;
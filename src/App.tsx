import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import Board from './components/Board';
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import Trash from './components/Trash';

interface IconClicked{
  iconClicked:Boolean;
}

const TotalWrapper=styled.div<IconClicked>`
    position:relative;
    min-width: 1000px;
  `

const Wrapper=styled.div`
    display:flex;
    max-width: 800px;
    min-width: 800px;
    margin:0 auto;
    justify-content: center;
    align-items: center;
    height:100vh;
`;

const Boards=styled.div`
  display:grid;
  grid-template-columns: repeat(3,1fr);
  gap:10px;
  width:100%;
  @media screen and (max-width:650px){
    grid-template-columns: repeat(2,1fr);
  }
  @media screen and (max-width:300px){
    grid-template-columns: repeat(1,1fr);
  }
`;

const Icon=styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top:50px;
  right:100px;
  font-size:40px;
  width:60px;
  height:60px;
  border-radius: 10px;
  &:hover{
    cursor: pointer;
    background-color:rgba(0,0,0,0.3);
  }
  @media screen and (max-width:300px){
    top:10px;
    right:40px;
  }
`

const AddBoardWrapper=styled.div`
  z-index: 10;
  position:fixed;
  margin:0 auto;
  width: 100%;
  height:100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const AddBoard=styled.div`
  background-color: ${props=>props.theme.boardColor};
  width: 20%;
  height: 20%;
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: space-around;
  position: relative;
  div:first-child{
    span{
      font-size:23px;
      position: absolute;
      top:10px;
      right:15px;
      &:hover{
        cursor: pointer;
        scale:1.1;
        transition:scale 0.1s ease-in;
      }
    }
  }
`

const Form=styled.form`
  position: relative;
  width: 100%;
  height:50%;
  display: flex;
  align-items: center;
  justify-content: center;
  input{
    width:190px;
    height:40px;
    border-radius: 5px;
    border:none;
  }
`

const Title=styled.h1`
  font-size:20px;
  font-weight:600;
  text-align: center;
  margin:20px 0px;
`

const Exit=styled.div`
  position: fixed;
`

const Button=styled.button`
  font-size:12px;
  background-color: skyblue;
  border: none;
  height:40px;
  width: 70px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  &:hover{
    cursor: pointer;
    scale:1.1;
    transition:scale 0.2s ease-in;
  }
`

function App() {
  const [toDos,setTodos]=useRecoilState(toDoState);
  const [click,setClick]=useState(false);
  const {register, handleSubmit, setValue}=useForm<{boardName:string}>();
  const onSubmit=({boardName}:{boardName:string})=>{
    setTodos(allBoards=>{
      return {
        ...allBoards,
        [boardName]:[]
      }
    })
    setValue("boardName","");
  }
  useEffect(()=>{
    const savedBoards=JSON.parse(localStorage.getItem("boards")||"{}");
    if(savedBoards!==JSON.parse("{}")){
      setTodos(JSON.parse(localStorage.getItem("boards")||"{}"));
    }
  },[])
  useEffect(()=>{
    localStorage.setItem("boards",JSON.stringify(toDos));
  },[toDos])
  const iconClicked=()=>{
    setClick(prev=>!prev);
  }
  const onDragEnd=(info:DropResult)=>{
  const {destination,source}=info;
    if(!destination) return;
    if(destination.droppableId===source.droppableId){
      const copyTodos=[...toDos[source.droppableId]];
      const targetTodo=copyTodos[source.index];
      copyTodos.splice(source.index,1);
      copyTodos.splice(destination.index,0,targetTodo);
      setTodos(allBoards=>{
        return {
          ...allBoards,
          [source.droppableId]:[...copyTodos]
        }
      })
    }
    if(destination.droppableId!==source.droppableId && destination.droppableId!=="trash"){
      const copySourceTodos=[...toDos[source.droppableId]];
      const copyDestTodos=[...toDos[destination.droppableId]];
      const targetTodo=copySourceTodos[source.index];
      copySourceTodos.splice(source.index,1);
      copyDestTodos.splice(destination.index,0,targetTodo);
      setTodos(allBoards=>{
        return {
          ...allBoards,
          [source.droppableId]:[...copySourceTodos],
          [destination.droppableId]:[...copyDestTodos]
        }
      })
    }
    if(destination.droppableId==="trash"){
      const copyTodos=[...toDos[source.droppableId]];
      copyTodos.splice(source.index,1);
      setTodos(allBoards=>{
        return {
          ...allBoards,
          [source.droppableId]:[...copyTodos]
        }
      })
    }
  }
  return <DragDropContext onDragEnd={onDragEnd}>
    <TotalWrapper iconClicked={click}>
    {click ? <AddBoardWrapper>
      <AddBoard>
      <div>
        <Title>Board Name:</Title>
        <span onClick={iconClicked}><FontAwesomeIcon icon={faXmark} /></span>
      </div>
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("boardName",{required:true})} placeholder="보드 이름" />
        </Form>
      </div>
      <div>
        <Button>Create</Button>
      </div>
      </AddBoard>
        </AddBoardWrapper> : null}
    <Icon onClick={iconClicked}>
      <FontAwesomeIcon icon={faPlus} />
    </Icon>
    <Wrapper>
      <Boards>
        {Object.keys(toDos).map(boardId=><Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />)}
      </Boards>
    </Wrapper>
    <Trash />
    </TotalWrapper>
  </DragDropContext>
}

export default App;

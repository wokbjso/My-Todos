import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import Board from './components/Board';
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

interface IconClicked{
  iconClicked:Boolean;
}

const TotalWrapper=styled.div<IconClicked>`
  width: 100%;
  height:100%;
  background-color: ${props=>props.iconClicked ? "#68FFF2" : props.theme.bgColor};
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
`

const AddBoardWrapper=styled.div`
  position:fixed;
  width:20%;
  height: 20%;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  div:first-child{
    width: 100%;
    display: flex;
    justify-content:center;
    position: relative;
    span{
      position: absolute;
      font-size:25px;
      top:0;
      right:10px;
      &:hover{
        cursor: pointer;
        scale:1.1;
        transition:scale 0.2s ease-in;
      }
    }
  }
`;

const Form=styled.form`
  position: relative;
  width: 100%;
  height:50%;
  display: flex;
  align-items: center;
  justify-content: center;
  input{
    width:250px;
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
    if(destination.droppableId!==source.droppableId){
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
  }
  return <DragDropContext onDragEnd={onDragEnd}>
    <TotalWrapper iconClicked={click}>
    <Icon onClick={iconClicked}>
      <FontAwesomeIcon icon={faPlus} />
    </Icon>
    <Wrapper>
    {click ? <AddBoardWrapper>
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
      </AddBoardWrapper> : null}
      <Boards>
        {Object.keys(toDos).map(boardId=><Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />)}
      </Boards>
    </Wrapper>
    </TotalWrapper>
  </DragDropContext>
}

export default App;

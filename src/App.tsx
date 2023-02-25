import React from 'react';
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import Board from './components/Board';

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

function App() {
  const [toDos,setTodos]=useRecoilState(toDoState);
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
    <Wrapper>
      <Boards>
        {Object.keys(toDos).map(boardId=><Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />)}
      </Boards>
    </Wrapper>
  </DragDropContext>
}

export default App;

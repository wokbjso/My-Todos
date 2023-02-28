import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Icon=styled.div`
    position:fixed;
    bottom:50px;
    right:150px;
    font-size:50px;
    width:200px;
    height:200px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
    cursor: pointer;
    background-color:rgba(0,0,0,0.3);
  }
    @media screen and (max-width:1400px){
            bottom:0px;
            right:0px;
    }
    @media screen and (max-width:1100px){
        font-size:35px;
        bottom:0px;
        right:-70px;
    }
`

const TrashIcon=styled.div<{isDraggingOver:Boolean}>`
    color:${props=>props.isDraggingOver ? "rgba(222, 57, 57, 0.8)" : "black"};
    transition:color 0.15s ease-in-out;
    width:30%;
    height:30%;
`

function Trash(){
    return <Icon>
        <Droppable droppableId="trash">
        {(provided, snapshot) => (
            <TrashIcon
            isDraggingOver={snapshot.isDraggingOver} 
            ref={provided.innerRef}
            {...provided.droppableProps}
            ><FontAwesomeIcon icon={faTrash} />
            {provided.placeholder}
            </TrashIcon>
  )}
        </Droppable>
    </Icon>
}


export default Trash;
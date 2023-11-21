'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useState, useRef } from 'react'

export default function MasterMind() {
  const [selectedColor, setSelectedColor] = useState(1)
  const [selectedRow, setSelectedRow] = useState(0)
  const [board, setBoard] = useState(
    [
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
    ]
  )
  const [secretCode, setSecretCode] = useState([
    (Math.floor(Math.random()*6)+1),
    (Math.floor(Math.random()*6)+1),
    (Math.floor(Math.random()*6)+1),
    (Math.floor(Math.random()*6)+1)
  ])
  const results = useRef(false)

  if(selectedRow >= board.length && !results.current){
    results.current = 'lose'
  }

  let canGuess = true
  if(selectedRow < board.length){
    board[selectedRow].pieces.forEach((piece) => {
      if(piece == 0){
        canGuess = false
      }
    })
  } else {
    canGuess = false
  }

  const reset = () => {
    setBoard([
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
      {pieces: [0,0,0,0], pins: [0,0,0,0]},
    ])
    let newSecretCode = [
      (Math.floor(Math.random()*6)+1),
      (Math.floor(Math.random()*6)+1),
      (Math.floor(Math.random()*6)+1),
      (Math.floor(Math.random()*6)+1)
    ]
    setSecretCode(newSecretCode)
    setSelectedRow(0)
    results.current = false
  }


  const placePiece = (row, piece) => {
    let newBoard = [...board]
    newBoard[row] = {
      ...newBoard[row],
      pieces: [...newBoard[row].pieces]
    }

    if(newBoard[row].pieces[piece] == selectedColor){
      newBoard[row].pieces[piece] = 0
    } else {
      newBoard[row].pieces[piece] = selectedColor
    }

    setBoard(newBoard)
  }



  const makeGuess = () => {
    let newBoard = [...board]
    newBoard[selectedRow] = {
      ...newBoard[selectedRow],
      pins: [...newBoard[selectedRow].pins]
    }
    let redPinNum = 0
    let whitePinNum = 0

    let secretCodeCopy = [...secretCode]
    board[selectedRow].pieces.forEach((piece, index) => {
      
      for(let i=0; i<secretCode.length; i++){
        if (secretCodeCopy[i] == piece){
          whitePinNum++
          secretCodeCopy[i] = 0
          break
        }
      }

      if(secretCode[index] == piece){
        redPinNum++
      }

    })
    whitePinNum = whitePinNum - redPinNum

    if(redPinNum == 4){
      results.current = 'win'
    }

    for(let i=0; i<redPinNum; i++){
      newBoard[selectedRow].pins[i] = 2
    }
    for(let i=0; i<whitePinNum; i++){
      newBoard[selectedRow].pins[i+redPinNum] = 1
    }


    setBoard(newBoard)
    setSelectedRow(selectedRow+1)
  }


  return(
    <main className={styles.main}>
      <h1 className={styles.MasterMindTitle}>MasterMind</h1>
      <button
        className={`${styles.guessButton} ${canGuess || (results.current != false) ? styles.canGuess : ''}`}
        onClick={
          () => canGuess && !results.current ? makeGuess() : 
          results.current != false ? reset() : ()=>{}
        }
      >
        {!results.current ? 'Guess' : 'Restart'}
      </button>


{/*
      testing buttons
      <button onClick={() => console.log(secretCode)}>see secret code</button>
      <button onClick={() => console.log(board[selectedRow].pieces)}>see code guess</button>
      <button onClick={() => console.log(results)}>see results</button> */}

      {!results.current ? 
        <div className={styles.board}>
          <div className={styles.boardLeftContainer}>

            {board.map((row, rowIndex) => (
              <div
              className={`${styles.row} ${rowIndex == selectedRow ? styles.selectedRow : ''}`}
              key={rowIndex}
              >

                {row.pieces.map((piece, pieceIndex) => (
                  <div
                  className={`${styles.piece} ${styles[`piece${piece}`]}`}
                  key={(rowIndex*4)+pieceIndex}
                  onClick={rowIndex == selectedRow && !results.current ? () => placePiece(rowIndex, pieceIndex) : ()=>{}}
                  ></div>
                ))}
                
                <div>
                  <div className={`${styles.pin} ${styles[`pin${row.pins[0]}`]}`}></div>
                  <div className={`${styles.pin} ${styles[`pin${row.pins[2]}`]}`}></div>
                </div>
                <div>
                  <div className={`${styles.pin} ${styles[`pin${row.pins[1]}`]}`}></div>
                  <div className={`${styles.pin} ${styles[`pin${row.pins[3]}`]}`}></div>
                </div>
              </div>

            ))}

          </div>
          <div>

            {[1,2,3,4,5,6].map((number) => (
              <div
              className={`${styles.piece} ${styles[`piece${number}`]} ${number == selectedColor ? styles.selectedPiece : ''}`}
              onClick={ () => setSelectedColor(number)}
              key={number}
              ></div>
            ))}

          </div>
        </div>
      :
        <div className={styles.column}>
          
          <h1 className={styles.MasterMindWinMessage}>You {results.current}</h1>

          <div className={styles.row}>
            {secretCode.map((number, index) => (
              <div
              className={`${styles.piece} ${styles[`piece${number}`]}`}
              key={index}
              >
              </div>
            ))}
          </div>

        </div>
      }

    </main>
  )
}

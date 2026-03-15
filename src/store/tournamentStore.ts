import { create } from 'zustand'

export interface TournamentPlayer {
  id: string
  name: string
  email: string
  isAI: boolean
  aiDifficulty?: 'easy' | 'medium' | 'hard' | 'nightmare'
}

export interface TournamentMatch {
  id: string
  round: number
  matchNumber: number
  player1: TournamentPlayer | null
  player2: TournamentPlayer | null
  winner: TournamentPlayer | null
  score: { player1: number; player2: number } | null
  status: 'pending' | 'ready' | 'in-progress' | 'completed'
}

export interface Tournament {
  id: string
  name: string
  playerCount: 4 | 8 | 16 | 32
  players: TournamentPlayer[]
  matches: TournamentMatch[]
  currentRound: number
  currentMatch: string | null
  status: 'setup' | 'registration' | 'in-progress' | 'completed'
  champion: TournamentPlayer | null
}

interface TournamentState {
  tournament: Tournament | null
  
  // Actions
  createTournament: (playerCount: 4 | 8 | 16 | 32) => void
  addPlayer: (player: TournamentPlayer) => void
  removePlayer: (playerId: string) => void
  fillWithAI: (difficulty: 'easy' | 'medium' | 'hard' | 'nightmare') => void
  startTournament: () => void
  setMatchWinner: (matchId: string, winner: TournamentPlayer, score: { player1: number; player2: number }) => void
  getCurrentMatch: () => TournamentMatch | null
  advanceToNextMatch: () => void
  resetTournament: () => void
}

export const useTournamentStore = create<TournamentState>((set, get) => ({
  tournament: null,
  
  createTournament: (playerCount) => {
    const tournament: Tournament = {
      id: `tournament-${Date.now()}`,
      name: 'Championship',
      playerCount,
      players: [],
      matches: [],
      currentRound: 1,
      currentMatch: null,
      status: 'registration',
      champion: null
    }
    set({ tournament })
  },
  
  addPlayer: (player) => {
    const { tournament } = get()
    if (!tournament) return
    if (tournament.players.length >= tournament.playerCount) return
    
    set({
      tournament: {
        ...tournament,
        players: [...tournament.players, player]
      }
    })
  },
  
  removePlayer: (playerId) => {
    const { tournament } = get()
    if (!tournament) return
    
    set({
      tournament: {
        ...tournament,
        players: tournament.players.filter(p => p.id !== playerId)
      }
    })
  },
  
  fillWithAI: (difficulty) => {
    const { tournament } = get()
    if (!tournament) return
    
    const spotsToFill = tournament.playerCount - tournament.players.length
    const aiPlayers: TournamentPlayer[] = []
    
    for (let i = 0; i < spotsToFill; i++) {
      aiPlayers.push({
        id: `ai-${Date.now()}-${i}`,
        name: `AI Bot ${i + 1}`,
        email: '',
        isAI: true,
        aiDifficulty: difficulty
      })
    }
    
    set({
      tournament: {
        ...tournament,
        players: [...tournament.players, ...aiPlayers]
      }
    })
  },
  
  startTournament: () => {
    const { tournament } = get()
    if (!tournament) return
    if (tournament.players.length !== tournament.playerCount) return
    
    // Shuffle players
    const shuffledPlayers = [...tournament.players].sort(() => Math.random() - 0.5)
    
    // Generate bracket matches
    const matches: TournamentMatch[] = []
    const totalRounds = Math.log2(tournament.playerCount)
    
    // First round matches
    for (let i = 0; i < tournament.playerCount / 2; i++) {
      matches.push({
        id: `match-1-${i}`,
        round: 1,
        matchNumber: i + 1,
        player1: shuffledPlayers[i * 2],
        player2: shuffledPlayers[i * 2 + 1],
        winner: null,
        score: null,
        status: i === 0 ? 'ready' : 'pending'
      })
    }
    
    // Create placeholder matches for subsequent rounds
    let matchesInRound = tournament.playerCount / 4
    for (let round = 2; round <= totalRounds; round++) {
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          id: `match-${round}-${i}`,
          round,
          matchNumber: i + 1,
          player1: null,
          player2: null,
          winner: null,
          score: null,
          status: 'pending'
        })
      }
      matchesInRound = matchesInRound / 2
    }
    
    set({
      tournament: {
        ...tournament,
        matches,
        currentMatch: matches[0].id,
        status: 'in-progress'
      }
    })
  },
  
  setMatchWinner: (matchId, winner, score) => {
    const { tournament } = get()
    if (!tournament) return
    
    const updatedMatches = tournament.matches.map(match => {
      if (match.id === matchId) {
        return { ...match, winner, score, status: 'completed' as const }
      }
      return match
    })
    
    // Find and update next round match
    const completedMatch = updatedMatches.find(m => m.id === matchId)
    if (completedMatch) {
      const nextRound = completedMatch.round + 1
      const nextMatchIndex = Math.floor((completedMatch.matchNumber - 1) / 2)
      const isFirstPlayer = (completedMatch.matchNumber - 1) % 2 === 0
      
      const nextMatch = updatedMatches.find(
        m => m.round === nextRound && m.matchNumber === nextMatchIndex + 1
      )
      
      if (nextMatch) {
        if (isFirstPlayer) {
          nextMatch.player1 = winner
        } else {
          nextMatch.player2 = winner
        }
        
        // If both players are set, match is ready
        if (nextMatch.player1 && nextMatch.player2) {
          nextMatch.status = 'ready'
        }
      }
    }
    
    // Check if tournament is complete
    const finalMatch = updatedMatches.find(m => m.round === Math.log2(tournament.playerCount))
    const isComplete = finalMatch?.status === 'completed'
    
    set({
      tournament: {
        ...tournament,
        matches: updatedMatches,
        status: isComplete ? 'completed' : 'in-progress',
        champion: isComplete ? winner : null
      }
    })
  },
  
  getCurrentMatch: () => {
    const { tournament } = get()
    if (!tournament) return null
    return tournament.matches.find(m => m.id === tournament.currentMatch) || null
  },
  
  advanceToNextMatch: () => {
    const { tournament } = get()
    if (!tournament) return
    
    // Find next ready match
    const nextMatch = tournament.matches.find(m => m.status === 'ready')
    
    set({
      tournament: {
        ...tournament,
        currentMatch: nextMatch?.id || null
      }
    })
  },
  
  resetTournament: () => {
    set({ tournament: null })
  }
}))

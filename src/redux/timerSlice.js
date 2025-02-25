import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeTimers:[],
    completedTimers:[]
}

const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        addTimer: (state, action) => {
            state.activeTimers.push(action.payload);
        },
        updateTimer: (state, action) => {
            const index = state.activeTimers.findIndex(timer => timer.id === action.payload.id);
            if(index != -1){
                state.activeTimers[index] = { 
                    ...state.activeTimers[index], 
                    remainingTime: action.payload.remainingTime,
                    isRunning: action.payload.isRunning,
                    status: action.payload.status 
                };
            }
        },
        removeTimer: (state, action) => {
            const completedTimer = state.activeTimers.find(timer => timer.id === action.payload);
            if (completedTimer) {
                completedTimer.isRunning = false;
                completedTimer.status = "Completed";
                state.completedTimers.push(completedTimer);
            }
        },
        resetTimer: (state, action) => {
            const index = state.activeTimers.findIndex(timer => timer.id === action.payload.id);
            if (index !== -1) {
                state.activeTimers[index] = { 
                    ...state.activeTimers[index], 
                    remainingTime: state.activeTimers[index].duration,
                    isRunning: false,
                    status: "PENDING"
                };
            }
        },
        addCompletedTimer: (state, action) => {
            const index = state.completedTimers.findIndex(timer => timer.id === action.payload.id);
            if (index !== -1) {
                state.completedTimers[index] = { 
                    ...state.completedTimers[index], 
                    isRunning: false,
                    status: "Completed"
                };
            }
        }
    },
});


export const { addTimer, updateTimer, removeTimer, resetTimer, addCompletedTimer } = timerSlice.actions;
export default timerSlice.reducer;
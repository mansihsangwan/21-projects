import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//fake data call from API 
export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Burger', price: 60, category: "Snacks" },
                { id: 2, name: 'Coffee', price: 80, category: "Beverages" },
                { id: 3, name: 'Dosa', price: 100, category: "Meals" },
                { id: 4, name: 'Roll', price: 120, category: "Snacks" }
            ])
        }, 2000)
    })
})

const menuSlice = createSlice({
    name: "menu",
    initialState: {
        items: [],
        status: 'idle',
        filter: "All",
    },
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload
        },
    },
     extraReducers: (builder) => {
        builder
            .addCase(fetchMenu.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchMenu.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload
            })
            .addCase(fetchMenu.rejected, (state) => {
                state.status = "failed";
            })

    },
   
});

export const {setFilter}=menuSlice.actions;
export default menuSlice.reducer
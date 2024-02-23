import { createSlice } from "@reduxjs/toolkit";

const databaseSlice = createSlice({
  name: 'database',
  initialState: {
    treePost: [],
    questionsAnswers: [],
    availableQA: 0,
  },
  reducers: {
    setTreePost: (state, action) => {
      state.treePost = action.payload;
    },
    setQuestionsAnswers: (state, action) => {
      state.questionsAnswers = action.payload;
    },
    setAvailableQA: (state, action) => {
      let count = 0;
      state.questionsAnswers.forEach((object) => {
        if(object.fields["Airtable ID"] === action.payload){
          count++;
        }
      })
      state.availableQA =  count;
    },
    debugTreePost: (state, action) => {
      state.treePost.map((object)=>{
        if(action.payload.includes(object.fields["Airtable ID"])){
          object.fields = {...object.fields, "Evaluation": "O"}
          return object
        } else {
          object.fields = {...object.fields, "Evaluation": "?"}
          return object
        }
      })
    }
  },
});
  
export const { setTreePost, setQuestionsAnswers, setAvailableQA, debugTreePost } = databaseSlice.actions;
export default databaseSlice.reducer;
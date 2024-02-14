import { createSlice } from "@reduxjs/toolkit";

const databaseSlice = createSlice({
  name: 'database',
  initialState: {
    treePost: [],
    questionsAnswers: [],
  },
  reducers: {
    setTreePost: (state, action) => {
      state.treePost = action.payload;
    },
    setQuestionsAnswers: (state, action) => {
      state.questionsAnswers = action.payload;
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
  
export const { setTreePost, setQuestionsAnswers, debugTreePost } = databaseSlice.actions;
export default databaseSlice.reducer;
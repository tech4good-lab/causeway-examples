I'm assuming the following sections will stay the same from the old platform:
- Introduction to Causeway
- Introduction to HTML
- Majority of "Declare text elements"
   - but the code snippet will instead be from weekly-goal-item.html and say
   ```
   <div>Finish Google Cover Letter</div>
   <div>#coverletter</div>
   ```
- Introduction to SCSS
- Majority of "Add selectors and style colors"
   - but the code snippets will instead be from weekly-goal-item.html and weekly-goal-item.component.scss to say
   ```
   <div class="goal-title">Finish Google Cover Letter</div>
   <div class="goal-hashtag">#coverletter</div>
   ``` 
   and 
   ```
   .goal-title {
      color: #4B5853;
   }

   .goal-hashtag {
      goal-title: #2DBDB1;
   }
   ```
- Majority of "Add remaining text styles"
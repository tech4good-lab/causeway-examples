# Weekly Goal Item Guide - Static Implementation

## Text Overview

In this phase, we write the html and scss for our component. We'll make use of flexbox styling to ensure this component matches its design when rendered by using ``display: flex;`` and ``flex-direction: row/column`` (for example) when appropriate, along with some padding between elements. We'll also define some SCSS variables for colors we'll use often in this file for easier readability.

## Code

### Mandatory to this section
- weekly-goal-item.component.html
```
<li class="weekly-goal">
  <mat-checkbox class="check-box"></mat-checkbox>
  <div class="goal-details">
    <div class="goal-title">Finish Google Cover Letter</div>
    <div class="bottom-row">
      <div class="goal-hashtag">#coverletter</div>
    </div>
  </div>
</li>
```

- weekly-goal-item.component.scss
```
$goal-hover-background: rgba(204, 239, 236, 0.25);
$divider-color: rgba(0, 0, 0, 0.15);

.weekly-goal {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 4px 0px;
  border-bottom: 1px solid $divider-color;


  &:hover {
    background: $goal-hover-background;
  }
  .goal-details {
    cursor: pointer;
    flex: 1;
    width: 100%;
    .goal-title {
      margin: 0;
      font-size: 16px;
      padding: 10px 0px 4px 0px;
    }
    .bottom-row {
      display: flex;
      .goal-hashtag {
        font-size: 13px;
        font-weight: 400;
      }
    }
  }
}
```

### Work for the app-weekly-goal-item & home
- weekly-goal.component.html
```
<article class="weekly-goals-container">
  <header class="weekly-goals-card">
    <div class="desktop-goal-titles">
      <div class="goal-titles">
        <div class="weekly-goals">Weekly Goals</div>
        <button class="edit-weekly-goals" aria-label="Edit goals">
          <img class="edit-icon" ngSrc="../../../../assets/images/edit.svg" alt="Edit" height="16" width="16"/>
        </button>
      </div>
      <div class="goal-time">7/7 - 7/13</div>
    </div>
  </header>
  <section class="goal-list">
      <ul class="goal-content">
         <app-weekly-goal-item/>
         <app-weekly-goal-item/>
         <app-weekly-goal-item/>
      </ul>
    <div class="add-goal-button">
      <button mat-button aria-label="Add goal">
        <div class="add-goal">+ Add a weekly goal</div>
      </button>
    </div>
  </section>
</article>
```
- weekly-goal.component.scss
```
$goal-hover-background: rgba(204, 239, 236, 0.25);
$divider-color: rgba(0, 0, 0, 0.15);

.weekly-goals-container {
  .weekly-goals-card {
    padding: 24px 0px 0px 10px;
    color: #4B5853;
    .desktop-goal-titles {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .goal-titles {
      display: flex;
      width: 100%;
  
      .weekly-goals {
        margin: 0;
        font-weight: 400;
        font-size: 28px;
      }
  
      .edit-weekly-goals {
        background: none;
        border: none;
        align-self: flex-end;
        justify-self: flex-end;
        margin-left: auto;
  
        .edit-icon {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
    }
  
    .goal-time {
      margin-top: 20px;
      font-weight: bold;
      font-size: 21px;
    }
  }

.goal-list {
  margin-top: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .no-goals {
    margin: 8px 8px;
    padding-top: 20px;
    font-style: italic;
    font-size: 16px;
    color:#859C93;
  }

  .goal-content {
    padding: 0;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: max(100vh - 420px);
  }
  .add-goal-button {
    flex: 1;
    margin-top: 12px;
      cursor: pointer;
          display: flex;
          padding-left: 4px;
      .add-goal {
          color: #5A5A5A;
          font-family: 'Oxygen';
          font-size: 16px;
          letter-spacing: 0px;
        }
  
  }
}
}
```
- home.component.html
```
<div class="dashboard-container">
  <!-- add in time-date header later in the guide -->
  <div class="goals">
      <ng-container>
      <article class="card-backgrounds-parent">
        <app-weekly-goals></app-weekly-goals>
      </article>
    </ng-container>
  </div>
</div>
```

- home.component.scss
```
$card-max-width: max(280px, 30vw);
$card-background-color: #fff;
$card-border-color: #ade1dd;
$card-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);

.dashboard-container {
  padding-top: 35px;
  height: calc(100% - 70px); /* Adjust the height to account for navbar */
  display: flex;
  flex-direction: column;
  gap: 20px;

  .goals {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;

  .card-backgrounds-parent {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    width: $card-max-width;
    box-sizing: border-box;
    text-align: left;
    font-family: 'Oxygen', sans-serif;
    border-radius: 10px 10px 0px 0px;
    background-color: $card-background-color;
    box-shadow: $card-shadow;
    border: 3px solid $card-border-color;
    padding: 10px;
    border-bottom: 0px;
    color: #4B5853;
  }
  }
}
```
- **additionally, edit.svg should show up in the diff as well in the assets folder**

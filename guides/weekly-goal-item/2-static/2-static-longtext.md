**Text is more in-line with Causeway style and roughly corresponds to the sections "Define and style elements" and "Position elements in a layout" from the original guide in terms of topics covered.**

*Text formatted according to [the style guide](https://docs.google.com/document/d/1KrUSlkgmklM7aqRV1VmsgT0ExjKpIeLW3cDXTEVrzEM/edit?usp=sharing)*

## Declare text elements
Let's get started on creating the weekly goals component. You can see the [full design](https://www.figma.com/design/EcsVaVYa8ecIg5J2GJAFA6WH/Compass-for-Causeway?node-id=0-1&t=qqCPJNDjdBvbIa00-1) for this component here, along with the other components we'll later implement in Causeway. For right now, we will identify and declare all the text elements of our component.

Let's start by focusing in on the individual items in the weekly goals - which we'll refer to as the component``weekly-goal-item``. We can have multiple weekly goals, so it makes sense to have each weekly goal be its own component for better efficiency and less code redundancy.

Let's start at the top of the component and work our way to the bottom of the component. Use the div tag to declare the text element Fall '18 Goals.

```
<div>Finish Google Cover Letter</div>
<div>#coverletter</div>
```


## Add selectors and style colors
Let's continue working on our Weekly Goals Item component. In Introduction to SCSS, we used element selectors to apply styles to all elements of a specific tag type. A more common approach is to add class attributes to HTML tags that allow one to target that specific element or a group of elements with common styles. Add class attributes to the card title using the following:
```
<div class="goal-title">Finish Google Cover Letter</div>
<div class="goal-hashtag">#coverletter</div>
```

To apply styles to all elements with a given class, use a . followed by the class value. Use this to specify the color of the title by adding the below code to our component's SCSS file, ``weekly-gooal-item.component.scss``:
```
.goal-title {
   color: #4B5853;
}

.goal-hashtag {
   goal-title: #2DBDB1;
}
```

## Using the Angular Material Library
Referring back to our component's [designs](https://www.figma.com/design/EcsVaVYa8ecIg5J2GJAFA6WH/Compass-for-Causeway?node-id=0-1&t=qqCPJNDjdBvbIa00-1), we should be able to check a goal off to mark it as completed. Any completed goals should remain checked, unless we decide to unmark it to be an incomplete goal again. Creating an element like a robust checkbox would be hard to do on our own, which is why many frameworks have their own or third-party material components library. For Angular, the most popular material component library is [Angular Material](https://material.angular.io/). This library gives us common reliable components to work without any headache. You'll find there's many other things it offers besides checkboxes (such as menus, buttons, etc.), so have a [look for yourself](https://material.angular.io/components/categories).

We can import Angular Material's checkbox component into our Weekly Goal Item component by modifying ``weekly-goal-item.component.ts`` like so:
```
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-weekly-goal-item',
  templateUrl: './weekly-goal-item.component.html',
  styleUrls: ['./weekly-goal-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalItemAnimations],
  imports: [
    MatCheckbox,
  ],
  standalone: true,
})
```

Because our Weekly Goal Item component is considered a standalone component, we can import the ``mat-checkbox`` component easily. Switching back to our html file now, we can add in our checkbox:
```
<li class="weekly-goal">
   <mat-checkbox class="check-box"></mat-checkbox>
   <div class="goal-title">Finish Google Cover Letter</div>
   <div class="goal-hashtag">#coverletter</div>
   </div>
</li>
```

You'll notice when this renders that the styling is a little bit off. We can address this easily using flexbox styling, which we'll cover in the next section.

## Introduction to Flex-box positioning
*I believe this section can stay the same as the original Causeway since it's a general example, but I can write something more for it if need be.* 

## Position Elements in a Layout

To implement flexbox styling properly for our component, we need to first identify how we'd like to group our elements to best match our design. The figure below shows some potential groupings. ![layout](layout-picture.png)

*Citation for below paragraph: Original Causeway*

Besides what is necessary to make sure all elements in a group are laid out vertically or horizontally, it is also common to define divs that correspond to a conceptual portion of the view (e.g. the "card header", the "tasks", or a "task") or to define divs corresponding to portions of the component that have a background or border (e.g. for the entire card).


![layout](layout-picture.png)

In ``weekly-goal-item.component.html``, let's add an li tag around all our elements to group them all together. We're choosing to use an li for this as it makes the most sense semantically within the larger context of our app Compass Goals, as Weekly Goal Items' parent container, Weekly Goals (we'll implement this later), is essentially a list of Weekly Goal Items. You can think of the future structure of Weekly Goals as similar to this:
```
<div>Weekly Goals</div>
<ul>
   <li>Weekly Goal 1</li>
   <li>Weekly Goal 2</li>
   <li>Weekly Goal 3</li>
</ul>
```
which will ultimately evolve into something more along the lines of this:
```
<div>Weekly Goals</div>
<ul>
   <app-weekly-goal-item/>
   <app-weekly-goal-item/>
   <app-weekly-goal-item/>
</ul>
```
That's why we're using the li tag for Weekly Goal Item. 

We'll also be updating the rest of hierarchy to better reflect the groupings we made earlier in our diagram, so we'll some more divs (with the class names "goal-details" and "bottom-row") around the divs for our goal's title and hashtags.
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

Looking good better now! If you'd like, you can take a peek at the HTML and SCSS files for our component's parent, Weekly Goals (+ its parent Home):
- ``weekly-goal.component.ts``
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
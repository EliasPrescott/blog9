---
title: "Lists or Tables?"
date: "2026-06-24"
tags:
- web-design
---

When you have a set of multi-column data records (or structs, or objects, or whatever you call them), do you format it as a list or a table?
This question has come up multiple times in my work recently, and I never had a clear answer.
Let's take a list of posts from this site as our first example.
Each post has two columns, a title, and the date the post was written.
The title is the primary focus, but I want to show the date to give readers a sense of time and to show how the list is sorted.

Sidenote: I am using the [`all: revert;`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/all) CSS property for these examples to preserve their styling over time.
I am also turning on horizontal scrolling for the examples to prevent bad wrapping on mobile screen sizes.
Generally, tables will wrap worse than lists will, especially when you have a small number of columns.
But once you get more complex lists, even they will get squashed at mobile sizes.

---

**Example 1a: a post list with all columns merged together**

<div class="reset-styles">
  <ul>
    <li>Being a Professional Programmer (2026-05-04)</li>
    <li>Godot Virtual Joystick (2026-04-22)</li>
    <li>Making a Lichess TV Viewer with Hyperscript (2026-04-16)</li>
  </ul>
</div>

---

This is exactly how I am currently displaying the posts on this site.
It is very simple and feels easy enough to read.
The main thing I want to point out is that this method does not align the second column horizontally.
Since each post's title has a differing length, each date ends up at a different position.
For the reader, it is difficult to visually jump between the same column on different rows if they are not aligned.

I think it makes sense to use a list in this case because the dates are secondary information to the title, so it is okay if they are not aligned.
Reader's can scan the titles easily enough because they are aligned at the start, and then the reader can follow the line to read the date, only if they are intrigued by the title first.

For the sake of comparison, let's see how I would format this list as a table.

---

**Example 1b: a post table with two columns**

<div class="reset-styles" style="font-size: 20px; overflow-x: scroll;">
  <table style="width: max-content;">
    <tbody>
      <tr>
        <td>Being a Professional Programmer</td>
        <td>2026-05-04</td>
      </tr>
      <tr>
        <td>Godot Virtual Joystick</td>
        <td>2026-04-22</td>
      </tr>
      <tr>
        <td>Making a Lichess TV Viewer with Hyperscript</td>
        <td>2026-04-16</td>
      </tr>
    </tbody>
  </table>
</div>

---

I do not mind formatting even a simple list like this as a table, but it feels a bit unnecessary when you only have two columns.
All the extra space between the shorter titles and the dates feels awkward to me.
Let's look at a more complex example where we have multiple columns with important information.

---

**Example 2a: a class list with ~7 columns**

<div class="reset-styles">
  <ul>
    <li>Painting I - $99</li>
    <ul>
      <li>8/27/2026 at Brook Pl, 1 meeting (Th), Register by 8/26/2026</li>
    </ul>
    <li>Basic Computer Literacy - $189</li>
    <ul>
      <li>10/12/2026-10/26/2026 at Brook Pl, 3 meetings (M), Register by 10/11/2026</li>
      <li>11/02/2026-11/16/2026 at Brook Pl, 3 meetings (M), Register by 11/15/2026</li>
    </ul>
    <li>Fishing - $60</li>
    <ul>
      <li>6/02/2026-6/30/2026 at River Rd, 5 meetings (T), Register by 6/01/2026</li>
      <li>12/17/2026-1/07/2027 at River Rd, 5 meetings (T), Register by 12/16/2026</li>
    </ul>
  </ul>
</div>

---

Here is a list of class information with around 7 columns depending on how you are counting.
I gave this version its best fighting chance by using nested lists for multiple instances of the same class on different dates.
I also pulled the cost out and put it with the title, assuming the cost should be the same for each instance of the class, also knowing that the cost is the most important information second only to the class title.

I enjoy this style of formatting lists quite a bit (perhaps because I came up with it on my own), but I am also interested in how it could be formatted as a table.

---

**Example 2b: a class table with ~7 columns**

<div class="reset-styles">
  <table>
    <thead>
      <tr>
        <th colspan="4">Class</th>
        <th>Location</th>
        <th>Register By</th>
      </tr>
    </thead>
    <tbody>
    <tr>
      <td colspan="6">Painting I - $99</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2">8/27/2026</td>
      <td>1 meeting (Th)</td>
      <td>Brook Pl</td>
      <td>8/26/2026</td>
    </tr>
    <tr>
      <td colspan="6">Basic Computer Literacy - $189</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2">10/12/2026-10/26/2026</td>
      <td>3 meetings (M)</td>
      <td>Brook Pl</td>
      <td>10/11/2026</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2">11/02/2026-11/16/2026</td>
      <td>3 meetings (M)</td>
      <td>Brook Pl</td>
      <td>11/15/2026</td>
    </tr>
    <tr>
      <td colspan="6">Fishing - $60</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2">6/02/2026-6/30/2026</td>
      <td>5 meetings (T)</td>
      <td>River Rd</td>
      <td>6/01/2026</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2">12/17/2026-1/07/2027</td>
      <td>5 meetings (T)</td>
      <td>River Rd</td>
      <td>12/16/2026</td>
    </tr>
    </tbody>
  </table>
</div>

---

I gave the table the same treatment as the list by pulling titles and costs out into a separate "header" row.
Even now, I am not sure which version I like better.
The list looks more pleasing to me visually, but I think the table would be easier to scan through quickly.
Plus, there is still some low hanging fruit for making the table look better if I were actually using it for a real project.
You could right-align the dates and the location columns, and think about switching to a font with more consistent number alignment for the dates.

Both the list and the table are extremely information-dense, which goes against the current trend of adding white-space to everything.
I think we do ourselves (and our users) a disservice though, if we automatically add white-space and reduce the information present on a page simply because that is the zeitgeist.

I have made websites where the information in the above table would have been spread out across multiple pages.
It made sense for me to design the site that way at the time, but I think there was an alternate path where I could have concentrated the information into a list or table like the ones shown above, and provided a better experience for our users.
Providing more information in the same place can dramatically reduce the amount of navigations the user has to endure.

It can also eliminate the need for more complicated features on your website.
If your users have to click into a separate page to view the information above for each class, then they will ask you for the ability to search by class title, location, dates, and probably price.
But, if you give your users a table or a list with all that important information already present, you are giving them the power to search and scan freely all on the same page.
Information-dense UIs put power back into the hands of the users, which is good for your users, but also good for you.

Going back to the title of this post: lists or tables?
My (boring) answer is **both, and make them as information-dense and easy to read as you can.**
The choice depends so much on the number of columns you are displaying and the type of data within those columns.

<style>
  .reset-styles {
    overflow-x: scroll;

    * {
      all: revert !important;
      font-size: 20px !important;
    }

    td:not(:last-child), th:not(:last-child) {
      padding-right: 1ch !important;
    }

    th {
      text-align: left !important;
    }

    table {
      border-collapse: collapse !important;
    }

    table, ul {
      width: max-content !important;
    }

    thead tr {
      border-bottom: 1px solid black !important;
    }
  }
</style>

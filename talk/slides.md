
Something about me

Why am I doing this talk?
Virtual reality is all the rage!
... but this starts from a real need

The company where I work
Hyperfair
does virtual tradeshows on the web
also virtual showrooms
seeing it is easier

Our core product...
has a UI
is in 3D
we are transitioning it to VR
(Oculus, Cardboard, Daydream)
we'll need our UI in VR, too!

Our core product...
is based on Unity3D
and so is our UI
but what if we wanted to use proper web technologies?

I have a dream
Of a world where developers can build 3D UIs
On the Web
In VR worlds
Using the same technologies and tools they already know and use every day

The 10 - 90 rule
10% inspiration
90% perspiration

I'm sorry
In this talk, the inspirational part is over
From now on it's all about doing the dirty job

On the web
UI === DOM
(usually with a framework on top)
VR === WebGL
(usually with a framework on top)

Can I haz...
DOM over WebGL?

Life is hard on us
CSS 3D transforms are unnatural
they don't really integrate with the WebGL Z buffer
they are, in general, "out" of the WebGL canvas

Can I haz...
DOM rendered in a Canvas context?
Through SVG, but it's almost a joke
CORS gets in the way
The security implications are nontrivial

I don't give up
Are there other options?
We can give up the DOM...
...and render our UI directly inside the WebGL canvas!

Not so fast, boy!
In VR, the WebGL canvas is in 3D mode
Usually we want our UI in 2D
Believe me, you *do* want a 2D UI

Idea!
We can render in another canvas and use that as a texture

A UI framework
One that we are used to
Let's pick React
- easy to separate logic from view code
- DOM-independent

A sample application
The ubiquitous todo list
Simplified

Implementation
Build the logic in Redux style
Then we'll reuse the logic in the 3D UI
Let's see how it looks

Back to the Canvas
What about...
...a canvas drawing framework...
...with React bindings?

Help!
Javascript fatigue is hitting us
Choice is good, but also hard
Always better than starting from scratch

Top choices
React-canvas
Pixi
Konva

Pick your poison
and do it wisely
because you'll live with it for longer than you think

I picked Konva
And added css-layout to it
I even did a pull request for this

The devil
is in the details

Issues
css-layout is not enough
propagating size info in the layout tree is cumbersome
mixing css-layout and konva styling is cumbersome
css-layout does not always do what you think
konva does not filter events selectively
konva does not handle key events

We solved these...
...and now?
We have a 2D UI inside a Canvas
We still need to show it in 3D
Let's build a 3D scene!
And then?

More issues!

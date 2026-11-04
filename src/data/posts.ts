export interface BlogPost {
  slug: string;
  title: string;
  page_title: string;
  datetime: string;
  date_display: string;
  read_time: string;
  content_html: string;
}

export const POSTS: BlogPost[] = [
  {
    slug: "strange-math-that-predicts-anything-almost",
    title: "strange math that predicts anything (almost)",
    page_title: "strange math that predicts anything (almost) · Tarun",
    datetime: "2026-11-05T00:00:00.000Z",
    date_display: "November 5, 2026",
    read_time: "7 min read",
    content_html: `<p>In 1906, a Russian mathematician named Andrei Markov got into a bitter argument with his former professor, Pavel Nekrasov. Nekrasov had published a paper arguing that probability and the law of large numbers only work when events are strictly independent. He then used that mathematical claim as theoretical proof for Christian theology and human free will.</p>

<p>Markov thought the math was sloppy and the conclusion was absurd. Instead of writing a counter-essay on philosophy, he sat down with a pencil and Alexander Pushkin's verse novel <em>Eugene Onegin</em>. He spent weeks tallying the first 20,000 Russian letters by hand, noting every vowel and consonant in sequence to test whether letters were independent.</p>

<p>He found that the probability of the next letter being a vowel was roughly 13% if the current letter was a vowel, but 66% if the current letter was a consonant. The sequence was clearly dependent on what came before it, yet across thousands of letters, the running proportions converged to steady numbers. That handwritten counterexample became the first Markov chain.</p>

<h3 id="the-memoryless-rule">The memoryless rule</h3>

<p>Most real-world models fail because tracking history is expensive. If the state of a system tomorrow depended on the full sequence of every action taken over the last five years, your state space explodes into an uncomputable mess.</p>

<p>Markov made one simplifying assumption: the future depends only on where you are right now. The past path you took to get here has zero additional effect.</p>

<p>In probability notation, this is the Markov property:</p>

<div class="math-block"><code>P(X[t+1] = s | X[t], X[t-1], ..., X[0]) = P(X[t+1] = s | X[t])</code></div>

<p>Think about a game of chess. To calculate what move to make next, you only need the coordinates of the pieces on the board right now. You do not need the score sheet of moves 1 through 40 to evaluate move 41. The current board state already holds all the necessary information.</p>

<h3 id="a-network-of-nodes">A network of four nodes</h3>

<p>Imagine a network of four interconnected nodes: A, B, C, and D. They could be web pages linking to each other, or servers forwarding packets across a cluster.</p>

<p>At every clock tick, whatever sits at a node picks one of the outgoing links and hops to the next destination:</p>

<ul>
  <li><strong>Node A</strong> links to B and C (50% chance each).</li>
  <li><strong>Node B</strong> links to C and D (50% chance each).</li>
  <li><strong>Node C</strong> links back to A (100% of its traffic).</li>
  <li><strong>Node D</strong> links to A and C (50% chance each).</li>
</ul>

<div class="prose-figure">
  <div class="prose-figure-svg">
    <svg viewBox="0 0 460 230" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 1.5 1.5 L 6.5 4 L 1.5 6.5" fill="none" stroke="var(--ink-3)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
        </marker>
      </defs>

      <!-- Edge: A -> B (0.5) -->
      <path d="M 214 56 L 118 108" stroke="var(--ink-3)" stroke-width="1.2" marker-end="url(#arr)"></path>
      <text x="156" y="74" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="10" text-anchor="middle" style="paint-order:stroke;stroke:var(--bg);stroke-width:4px;">0.5</text>

      <!-- Edge: A -> C (0.5) -->
      <path d="M 246 56 L 342 108" stroke="var(--ink-3)" stroke-width="1.2" marker-end="url(#arr)"></path>
      <text x="304" y="74" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="10" text-anchor="middle" style="paint-order:stroke;stroke:var(--bg);stroke-width:4px;">0.5</text>

      <!-- Edge: B -> C (0.5) -->
      <path d="M 124 120 L 336 120" stroke="var(--ink-3)" stroke-width="1.2" marker-end="url(#arr)"></path>
      <text x="210" y="114" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="10" text-anchor="middle" style="paint-order:stroke;stroke:var(--bg);stroke-width:4px;">0.5</text>

      <!-- Edge: B -> D (0.5) -->
      <path d="M 118 132 L 214 184" stroke="var(--ink-3)" stroke-width="1.2" marker-end="url(#arr)"></path>
      <text x="156" y="168" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="10" text-anchor="middle" style="paint-order:stroke;stroke:var(--bg);stroke-width:4px;">0.5</text>

      <!-- Edge: D -> C (0.5) -->
      <path d="M 246 184 L 342 132" stroke="var(--ink-3)" stroke-width="1.2" marker-end="url(#arr)"></path>
      <text x="304" y="168" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="10" text-anchor="middle" style="paint-order:stroke;stroke:var(--bg);stroke-width:4px;">0.5</text>

      <!-- Edge: D -> A (0.5) vertical through middle -->
      <path d="M 226 172 L 226 68" stroke="var(--ink-3)" stroke-width="1.2" marker-end="url(#arr)"></path>
      <text x="216" y="145" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="10" text-anchor="middle" style="paint-order:stroke;stroke:var(--bg);stroke-width:4px;">0.5</text>

      <!-- Edge: C -> A (1.0) outer curve on right -->
      <path d="M 364 104 C 380 60, 310 26, 248 38" stroke="var(--ink-3)" stroke-width="1.2" fill="none" marker-end="url(#arr)"></path>
      <text x="340" y="44" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="10" text-anchor="middle" style="paint-order:stroke;stroke:var(--bg);stroke-width:4px;">1.0</text>

      <!-- Node A (top) -->
      <g transform="translate(230, 46)">
        <circle r="18" fill="var(--bg)" stroke="var(--line-strong)" stroke-width="1.2"></circle>
        <circle r="3.5" fill="#3b82f6"></circle>
        <text x="0" y="-24" fill="var(--ink)" font-family="var(--font-mono)" font-size="11" font-weight="600" text-anchor="middle">Node A</text>
      </g>

      <!-- Node B (left) -->
      <g transform="translate(100, 120)">
        <circle r="18" fill="var(--bg)" stroke="var(--line-strong)" stroke-width="1.2"></circle>
        <circle r="3.5" fill="#f97316"></circle>
        <text x="-28" y="4" fill="var(--ink)" font-family="var(--font-mono)" font-size="11" font-weight="600" text-anchor="end">Node B</text>
      </g>

      <!-- Node C (right) -->
      <g transform="translate(360, 120)">
        <circle r="18" fill="var(--bg)" stroke="var(--line-strong)" stroke-width="1.2"></circle>
        <circle r="3.5" fill="#10b981"></circle>
        <text x="28" y="4" fill="var(--ink)" font-family="var(--font-mono)" font-size="11" font-weight="600" text-anchor="start">Node C</text>
      </g>

      <!-- Node D (bottom) -->
      <g transform="translate(230, 194)">
        <circle r="18" fill="var(--bg)" stroke="var(--line-strong)" stroke-width="1.2"></circle>
        <circle r="3.5" fill="#8b5cf6"></circle>
        <text x="0" y="32" fill="var(--ink)" font-family="var(--font-mono)" font-size="11" font-weight="600" text-anchor="middle">Node D</text>
      </g>
    </svg>
  </div>
</div>

<h3 id="turning-transitions-into-a-matrix">Turning transitions into a matrix</h3>

<p>Diagrams on a whiteboard are nice for intuition, but computers prefer linear algebra. We can pack these probabilities into a square stochastic matrix P, where row i contains the odds of moving from node i to all other nodes:</p>

<pre><code>         [   A     B     C     D   ]
P = A    [ 0.00  0.50  0.50  0.00 ]
    B    [ 0.00  0.00  0.50  0.50 ]
    C    [ 1.00  0.00  0.00  0.00 ]
    D    [ 0.50  0.00  0.50  0.00 ]</code></pre>

<p>Every single row sums to 1.0, because a packet sitting at any node must move somewhere on the next tick.</p>

<p>Suppose our packet begins at Node A. The initial probability vector v(0) is:</p>

<div class="math-block"><code>v(0) = [ 1.0, 0.0, 0.0, 0.0 ]   (100% at Node A)</code></div>

<p>Where is the packet after one hop? You multiply your vector by the matrix P:</p>

<div class="math-block"><code>v(1) = v(0) × P = [ 0.0, 0.5, 0.5, 0.0 ]</code></div>

<p>For two hops, multiply again:</p>

<div class="math-block"><code>v(2) = v(1) × P = v(0) × P² = [ 0.50, 0.00, 0.25, 0.25 ]</code></div>

<p>For any step n in the future, the distribution is simply:</p>

<div class="math-block"><code>v(n) = v(0) × Pⁿ</code></div>

<h3 id="the-steady-state-miracle">The steady state miracle</h3>

<p>Here is where the math gets strange. Watch what happens to the distribution as the hops increment:</p>

<table>
  <thead>
    <tr>
      <th>Step</th>
      <th>Node A</th>
      <th>Node B</th>
      <th>Node C</th>
      <th>Node D</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>t = 0</td>
      <td>100.0%</td>
      <td>0.0%</td>
      <td>0.0%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>t = 1</td>
      <td>0.0%</td>
      <td>50.0%</td>
      <td>50.0%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>t = 2</td>
      <td>50.0%</td>
      <td>0.0%</td>
      <td>25.0%</td>
      <td>25.0%</td>
    </tr>
    <tr>
      <td>t = 3</td>
      <td>37.5%</td>
      <td>25.0%</td>
      <td>37.5%</td>
      <td>0.0%</td>
    </tr>
    <tr>
      <td>t = 4</td>
      <td>37.5%</td>
      <td>18.8%</td>
      <td>31.2%</td>
      <td>12.5%</td>
    </tr>
    <tr>
      <td>t = 6</td>
      <td>39.1%</td>
      <td>18.8%</td>
      <td>32.8%</td>
      <td>9.4%</td>
    </tr>
    <tr>
      <td>t = 8</td>
      <td>38.3%</td>
      <td>18.8%</td>
      <td>33.2%</td>
      <td>9.8%</td>
    </tr>
    <tr>
      <td>Steady State (π)</td>
      <td>38.1%</td>
      <td>19.0%</td>
      <td>33.3%</td>
      <td>9.5%</td>
    </tr>
  </tbody>
</table>

<p>By step 8, the numbers freeze in place. Even if you started 100% at Node B, or 100% at Node D, you will still land at the exact same split: roughly 38.1% at Node A, 33.3% at Node C, 19.0% at Node B, and 9.5% at Node D.</p>

<p>Why does Node A win? Because Node C channels 100% of its traffic straight back to A, and Node D also sends half its traffic to A. The traffic distribution reflects the network topology.</p>

<p>This invariant vector is called the stationary distribution, written as π. It satisfies one of the cleanest equations in linear algebra:</p>

<div class="math-block"><code>π × P = π</code></div>

<p>Multiplying π by P yields back π. The system reaches equilibrium.</p>

<div class="prose-figure">
  <div class="prose-figure-svg">
    <svg viewBox="0 0 460 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Grid lines -->
      <line x1="38" y1="20" x2="445" y2="20" stroke="var(--line)" stroke-dasharray="2 3"></line>
      <line x1="38" y1="50" x2="445" y2="50" stroke="var(--line)" stroke-dasharray="2 3"></line>
      <line x1="38" y1="80" x2="445" y2="80" stroke="var(--line)" stroke-dasharray="2 3"></line>
      <line x1="38" y1="110" x2="445" y2="110" stroke="var(--line)" stroke-dasharray="2 3"></line>
      <line x1="38" y1="140" x2="445" y2="140" stroke="var(--line)"></line>

      <!-- Y Axis Labels -->
      <text x="30" y="23" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="8.5" text-anchor="end">100%</text>
      <text x="30" y="83" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="8.5" text-anchor="end">50%</text>
      <text x="30" y="143" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="8.5" text-anchor="end">0%</text>

      <!-- Bar 0: t=0 [100, 0, 0, 0] -->
      <g transform="translate(54, 0)">
        <rect x="0" y="20" width="22" height="120" rx="3" fill="#3b82f6"></rect>
        <text x="11" y="156" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">t=0</text>
      </g>

      <!-- Bar 1: t=1 [0, 50, 50, 0] -->
      <g transform="translate(108, 0)">
        <rect x="0" y="20" width="22" height="60" rx="3" fill="#10b981"></rect>
        <rect x="0" y="80" width="22" height="60" rx="3" fill="#f97316"></rect>
        <text x="11" y="156" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">t=1</text>
      </g>

      <!-- Bar 2: t=2 [50, 0, 25, 25] -->
      <g transform="translate(162, 0)">
        <rect x="0" y="20" width="22" height="30" rx="3" fill="#8b5cf6"></rect>
        <rect x="0" y="50" width="22" height="30" fill="#10b981"></rect>
        <rect x="0" y="80" width="22" height="60" rx="3" fill="#3b82f6"></rect>
        <text x="11" y="156" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">t=2</text>
      </g>

      <!-- Bar 3: t=3 [37.5, 25, 37.5, 0] -->
      <g transform="translate(216, 0)">
        <rect x="0" y="20" width="22" height="45" rx="3" fill="#10b981"></rect>
        <rect x="0" y="65" width="22" height="30" fill="#f97316"></rect>
        <rect x="0" y="95" width="22" height="45" rx="3" fill="#3b82f6"></rect>
        <text x="11" y="156" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">t=3</text>
      </g>

      <!-- Bar 4: t=4 [37.5, 18.8, 31.2, 12.5] -->
      <g transform="translate(270, 0)">
        <rect x="0" y="20" width="22" height="15" rx="3" fill="#8b5cf6"></rect>
        <rect x="0" y="35" width="22" height="37" fill="#10b981"></rect>
        <rect x="0" y="72" width="22" height="23" fill="#f97316"></rect>
        <rect x="0" y="95" width="22" height="45" rx="3" fill="#3b82f6"></rect>
        <text x="11" y="156" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">t=4</text>
      </g>

      <!-- Bar 5: t=6 [39.1, 18.8, 32.8, 9.4] -->
      <g transform="translate(324, 0)">
        <rect x="0" y="20" width="22" height="11" rx="3" fill="#8b5cf6"></rect>
        <rect x="0" y="31" width="22" height="40" fill="#10b981"></rect>
        <rect x="0" y="71" width="22" height="22" fill="#f97316"></rect>
        <rect x="0" y="93" width="22" height="47" rx="3" fill="#3b82f6"></rect>
        <text x="11" y="156" fill="var(--ink-2)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">t=6</text>
      </g>

      <!-- Bar 6: Steady state [38.1, 19.0, 33.3, 9.5] -->
      <g transform="translate(388, 0)">
        <rect x="0" y="20" width="22" height="11" rx="3" fill="#8b5cf6"></rect>
        <rect x="0" y="31" width="22" height="40" fill="#10b981"></rect>
        <rect x="0" y="71" width="22" height="23" fill="#f97316"></rect>
        <rect x="0" y="94" width="22" height="46" rx="3" fill="#3b82f6"></rect>
        <text x="11" y="156" fill="var(--ink)" font-family="var(--font-mono)" font-size="9" font-weight="600" text-anchor="middle">steady</text>
      </g>
    </svg>
  </div>
  <div class="prose-figure-legend">
    <span class="legend-item"><span class="legend-color" style="background:#3b82f6;"></span> Node A (38.1%)</span>
    <span class="legend-item"><span class="legend-color" style="background:#10b981;"></span> Node C (33.3%)</span>
    <span class="legend-item"><span class="legend-color" style="background:#f97316;"></span> Node B (19.0%)</span>
    <span class="legend-item"><span class="legend-color" style="background:#8b5cf6;"></span> Node D (9.5%)</span>
  </div>
</div>

<h3 id="where-this-runs-the-world">Where this runs the world</h3>

<p>Once you understand stationary distributions, you spot them across systems infrastructure.</p>

<p>In 1998, Larry Page and Sergey Brin realized the entire World Wide Web could be treated as a giant Markov chain. Each webpage is a node, and each hyperlink is a transition. A random web surfer navigates by clicking links at random, with a small teleportation probability (the damping factor) to avoid getting trapped in dead ends.</p>

<p>The stationary vector π of that massive transition graph gives the long-term probability of finding the surfer on any specific page. Pages with many incoming links from other important pages naturally accumulate high stationary mass. That vector became Google PageRank.</p>

<p>Text generation also started here. Decades before modern language models, simple n-gram Markov chains generated text by tallying word pairs from a corpus and choosing the next token by weighted probability. It was fast and ran in a few lines of C.</p>

<p>In network engineering and distributed storage, queuing theory uses continuous-time Markov chains to model packet buffers and thread pools. If requests arrive at rate λ and finish at rate μ, the stationary distribution over queue lengths tells you whether your servers will hold steady or exhaust their memory under heavy traffic.</p>

<p>You can simulate this in a few lines of Python using NumPy's matrix multiplication operator (@):</p>

<pre><code>import numpy as np

P = np.array([
    [0.0, 0.5, 0.5, 0.0],
    [0.0, 0.0, 0.5, 0.5],
    [1.0, 0.0, 0.0, 0.0],
    [0.5, 0.0, 0.5, 0.0],
])

# Initial state: 100% at Node A
v = np.array([1.0, 0.0, 0.0, 0.0])

for t in range(9):
    row = " ".join(f"{x*100:4.1f}%" for x in v)
    print(f"t={t} | {row}")
    v = v @ P</code></pre>

<h3 id="the-erasure-of-history">The erasure of history</h3>

<p>There is something almost philosophical about how stationary distributions work. No matter which node you pick as your starting point, whether you begin 100% at Node A or Node D, the memory of that initial position decays with every matrix multiplication. Within eight to ten steps, your starting position is completely forgotten.</p>

<p>The system does not keep a ledger of how it got here. It does not carry the baggage of past moves. Yet despite that lack of memory, the long-term outcome is completely deterministic. The stationary distribution is baked directly into the graph topology.</p>

<p>Most software systems struggle because engineers assume predictability requires recording everything: building massive audit trails, complex state machines, and endless event logs. Markov's insight was the opposite. If the transition rules between states are sound, you can discard history entirely, look only at the present step, and still know with mathematical certainty where the system will settle.</p>

<p>In 1906, Andrei Markov set out to win a petty academic feud about Russian vowels. He ended up uncovering one of the most practical tools in computing: a way to predict the long-term behavior of complex networks using nothing more than local transitions and a single matrix.</p>`
  }
];

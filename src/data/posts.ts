export interface BlogPost {
  slug: string;
  title: string;
  page_title: string;
  datetime: string;
  date_display: string;
  read_time: string;
  content_html: string;
  hide_from_home?: boolean;
}

export const POSTS: BlogPost[] = [
  {
    slug: "strange-math-that-predicts-anything-almost",
    title: "strange math that predicts anything (almost)",
    page_title: "strange math that predicts anything (almost) · Tarun",
    datetime: "2026-11-05T00:00:00.000Z",
    date_display: "November 5, 2026",
    read_time: "7 min read",
    content_html: `<p>In 1906, Andrei Markov got into an argument with his former professor, Pavel Nekrasov. Nekrasov claimed the law of large numbers only worked for independent events, using the math to defend theological free will. Markov thought the math was sloppy and set out to prove him wrong.</p>

<p>Instead of writing a philosophical rebuttal, Markov spent weeks tallying 20,000 letters from Pushkin's novel <em>Eugene Onegin</em>. Vowels followed vowels only 13% of the time, but followed consonants 66% of the time. The sequence was dependent, yet the proportions converged to steady numbers. That counterexample became the first Markov chain.</p>

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

<p>No matter where you start in the network, the memory of that initial state decays with every step. Within ten hops, the origin is completely erased. The system carries no past baggage, yet its long-term destination remains strictly determined by the graph topology.</p>

<p>In software, we often assume predictability requires recording everything. Markov showed that if local transition rules are sound, you can discard history entirely. You only need to know where you are right now to know where the system will settle.</p>`
  },
  {
    slug: "why-more-cores-stop-helping",
    title: "why more cores stop helping",
    page_title: "why more cores stop helping · Tarun",
    datetime: "2026-11-07T00:00:00.000Z",
    date_display: "November 7, 2026",
    read_time: "5 min read",
    hide_from_home: true,
    content_html: `<p>In 1967, computer architect Gene Amdahl stood in front of a conference audience in Atlantic City and presented a three-page paper. The industry was enthusiastic about parallel computing. Hardware vendors promised that wiring dozens of processors together would make programs arbitrarily fast.</p>

<p>Amdahl was skeptical. As the chief architect of the IBM System/360, he understood how software behaved on real hardware. With basic arithmetic, he proved that no matter how many processors you add, the overall speedup is strictly bound by the work that must run sequentially.</p>

<h3 id="the-arithmetic-of-speed">The arithmetic of speed</h3>

<p>Every program divides into two distinct parts: the fraction that can run concurrently across multiple threads, and the fraction that must execute in strict sequence.</p>

<p>If p represents the parallel fraction, the theoretical speedup S(n) achievable with n processor cores follows Amdahl's law:</p>

<div class="math-block"><code>S(n) = 1 / ((1 - p) + (p / n))</code></div>

<p>Here, 1 - p is the serial bottleneck. When the number of cores n grows toward infinity, the parallel term p / n shrinks to zero. Only the serial barrier remains:</p>

<div class="math-block"><code>limit as n → ∞ : S(∞) = 1 / (1 - p)</code></div>

<h3 id="the-asymptotic-wall">The asymptotic wall</h3>

<p>The implications are unforgiving. Suppose 95% of your application runs in parallel, leaving just 5% of serial execution. Your theoretical maximum speedup ceiling is 1 divided by 0.05. That equals exactly 20.</p>

<p>It does not matter whether you run sixteen cores or ten thousand GPUs. You can never achieve more than a twenty-fold speedup over a single thread. With a 10% serial fraction, your ceiling drops to 10x. With 25% serial work, you hit an immovable ceiling at 4x.</p>

<div class="prose-figure">
  <div class="prose-figure-svg">
    <svg viewBox="0 0 460 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Grid lines -->
      <line x1="45" y1="20" x2="440" y2="20" stroke="var(--line)" stroke-dasharray="2 3"></line>
      <line x1="45" y1="55" x2="440" y2="55" stroke="var(--line)" stroke-dasharray="2 3"></line>
      <line x1="45" y1="90" x2="440" y2="90" stroke="var(--line)" stroke-dasharray="2 3"></line>
      <line x1="45" y1="125" x2="440" y2="125" stroke="var(--line)" stroke-dasharray="2 3"></line>
      <line x1="45" y1="160" x2="440" y2="160" stroke="var(--line)"></line>

      <!-- Y Axis Labels -->
      <text x="36" y="24" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="end">20x</text>
      <text x="36" y="59" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="end">15x</text>
      <text x="36" y="94" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="end">10x</text>
      <text x="36" y="129" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="end">5x</text>
      <text x="36" y="163" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="end">1x</text>

      <!-- X Axis Labels -->
      <text x="45" y="176" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">1</text>
      <text x="89" y="176" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">8</text>
      <text x="139" y="176" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">16</text>
      <text x="239" y="176" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">32</text>
      <text x="340" y="176" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">48</text>
      <text x="440" y="176" fill="var(--ink-3)" font-family="var(--font-mono)" font-size="9" text-anchor="middle">64</text>

      <!-- Asymptotes -->
      <line x1="45" y1="20" x2="440" y2="20" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"></line>
      <line x1="45" y1="90" x2="440" y2="90" stroke="#10b981" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"></line>
      <line x1="45" y1="132" x2="440" y2="132" stroke="#f97316" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"></line>
      <line x1="45" y1="146" x2="440" y2="146" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"></line>

      <!-- Curves -->
      <path d="M 45.0,153.0 L 51.3,146.7 L 63.8,135.7 L 88.9,118.5 L 114.0,105.8 L 139.0,96.0 L 164.1,88.2 L 189.2,81.9 L 214.3,76.6 L 239.4,72.2 L 289.5,65.1 L 339.7,59.7 L 389.8,55.5 L 440.0,52.0" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M 45.0,153.0 L 51.3,147.3 L 63.8,138.5 L 88.9,127.1 L 114.0,120.0 L 139.0,115.2 L 164.1,111.7 L 189.2,109.1 L 214.3,107.0 L 239.4,105.4 L 289.5,102.9 L 339.7,101.1 L 389.8,99.7 L 440.0,98.6" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M 45.0,153.0 L 51.3,148.8 L 63.8,144.0 L 88.9,139.6 L 114.0,137.6 L 139.0,136.4 L 164.1,135.7 L 189.2,135.1 L 214.3,134.7 L 239.4,134.4 L 289.5,134.0 L 339.7,133.6 L 389.8,133.4 L 440.0,133.3" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M 45.0,153.0 L 51.3,150.7 L 63.8,148.8 L 88.9,147.6 L 114.0,147.1 L 139.0,146.8 L 164.1,146.7 L 189.2,146.6 L 214.3,146.5 L 239.4,146.4 L 289.5,146.3 L 339.7,146.3 L 389.8,146.2 L 440.0,146.2" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </div>
  <div class="prose-figure-legend">
    <span class="legend-item"><span class="legend-color" style="background:#3b82f6;"></span> 95% parallel (limit 20x)</span>
    <span class="legend-item"><span class="legend-color" style="background:#10b981;"></span> 90% parallel (limit 10x)</span>
    <span class="legend-item"><span class="legend-color" style="background:#f97316;"></span> 75% parallel (limit 4x)</span>
    <span class="legend-item"><span class="legend-color" style="background:#8b5cf6;"></span> 50% parallel (limit 2x)</span>
  </div>
</div>

<h3 id="where-serial-bottlenecks-hide">Where serial bottlenecks hide</h3>

<p>In backend engineering, serial bottlenecks rarely present themselves as raw CPU instructions. They hide in architectural dependencies. A database transaction waiting on a row lock, an API gateway doing sequential TLS handshakes, or a Kafka queue pinned to a single partition key.</p>

<p>Engineers often respond by adding worker threads or scaling container replicas. But if the underlying bottleneck is a mutex lock or disk write barrier, additional workers only increase thread contention and scheduling latency. The CPUs run hotter, but throughput stays flat.</p>

<h3 id="diminishing-returns">Diminishing returns</h3>

<p>You can verify the arithmetic in a few lines of Python:</p>

<pre><code>def speedup(p, n):
    return 1.0 / ((1.0 - p) + (p / n))

p = 0.95
for cores in [1, 2, 4, 8, 16, 64, 1024]:
    s = speedup(p, cores)
    print(f"{cores:4d} cores: {s:5.2f}x")</code></pre>

<p>At 16 cores, you reach an 11.4x speedup. At 64 cores, you reach 16.8x. At 1,024 cores, you crawl to 19.8x. You burned 64 times more hardware for an incremental gain of less than 3x.</p>

<h3 id="shrinking-the-non-parallel-tail">Shrinking the non-parallel tail</h3>

<p>Optimizing distributed systems is rarely about speeding up the 95% of code that already scales. It is entirely about hunting down and eliminating the 5% that does not.</p>

<p>Cutting a serial section from 5% to 1% raises your theoretical speedup ceiling from 20x to 100x. Moving from synchronous locks to lock-free ring buffers or event-driven pipelines does more for throughput than any machine upgrade. Amdahl's law reminds us that scale is defined by what refuses to run in parallel.</p>`
  }
];

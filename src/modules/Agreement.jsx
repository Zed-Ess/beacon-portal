import styles from "./Agreement.module.css";

export default function Agreement() {
  return (
    <div className={styles.page}>

      <header className={styles.docHeader}>
        <span className={styles.lamp}>🏮</span>
        <h2>Beacon Educational Consult</h2>
        <p>Partnership Agreement &mdash; Joint Development and Sale of Academic Materials</p>
        <p className={styles.subtitle}>
          Schemes of Work &bull; Lesson Plans &bull; Examination Questions &bull; Textbooks &bull; Workbooks
        </p>
      </header>

      {/* Article 1 */}
      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 1</span> Name, Purpose and Status</h3>

        <h4>1.1 Name</h4>
        <p>This partnership shall operate under the name <strong>Beacon Educational Consult</strong>.</p>

        <h4>1.2 Purpose</h4>
        <p>This partnership exists to advance the quality of education in Ghanaian basic schools through four interconnected purposes:</p>
        <ol>
          <li><strong>Professional Collaboration and Resource Sharing.</strong> To bring together experienced, practicing educators to collaborate in planning, sharing, and improving teaching resources, so that the knowledge and expertise held by individual teachers benefits the wider group and, ultimately, their learners.</li>
          <li><strong>Development and Distribution of Curriculum-Aligned Academic Materials.</strong> To collaboratively plan, develop, produce, and distribute high-quality academic materials — including Schemes of Work, Lesson Notes, End-of-Term Examination Questions, Textbooks, and Workbooks — that are fully aligned with the NaCCA/GES curriculum and support effective teaching and learning in basic schools across Ghana.</li>
          <li><strong>Commercial Sustainability through the Sale of Educational Materials.</strong> To market and sell the partnership's academic materials to schools and individual educators, generating revenue that sustains the partnership's operations, fairly compensates contributing partners, and funds continued material development.</li>
          <li><strong>Capacity Building for the Wider Educational Community.</strong> To contribute beyond the partnership itself by organizing workshops, seminars, and conferences for fellow educators — sharing the professional knowledge, curriculum expertise, and practical experience that the partners have collectively gained, thereby strengthening the broader teaching profession in Ghana.</li>
        </ol>

        <h4>1.3 Specific Objectives</h4>
        <p>In pursuit of the purposes above, the partnership shall:</p>
        <ul>
          <li>Develop and maintain a growing catalog of NaCCA-aligned academic materials across key subjects and grade levels</li>
          <li>Establish and follow a rigorous production and quality assurance workflow before releasing any material for sale</li>
          <li>Build and sustain direct relationships with schools, circuit supervisors, and education stakeholders for material distribution</li>
          <li>Organize at least <mark>[X]</mark> professional development event(s) per year — workshops, seminars, or conferences — open to educators beyond the partnership</li>
          <li>Ensure all partners engage in continuous professional learning and development as a condition of active membership</li>
          <li>Pursue registration and listing of eligible materials through NaCCA's textbook evaluation process where appropriate</li>
        </ul>

        <h4>1.4 Legal Status</h4>
        <p>The partners agree to register this entity as a <mark>[business name / partnership / limited liability company]</mark> with the Registrar General's Department, and to obtain a Ghana Revenue Authority Taxpayer Identification Number (TIN), before any commercial sale of materials begins.</p>
        <p className={styles.note}>Registration type to be confirmed: a registered partnership or business name is simpler and cheaper to set up; a limited liability company offers stronger personal liability protection for partners as revenue and risk grow.</p>
      </section>

      {/* Article 2 */}
      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 2</span> Partners and Contributions</h3>

        <h4>2.1 Founding Partners</h4>
        <div className={styles.tblWrap}>
          <table>
            <thead><tr><th>Name</th><th>Subject Specialism</th><th>Initial Role</th></tr></thead>
            <tbody>
              <tr><td><mark>[Founder Name]</mark></td><td>English Language, Computing, Integrated Science</td><td>Founder / Coordinator / Production Lead</td></tr>
            </tbody>
          </table>
        </div>

        <h4>2.2 Founder Recognition</h4>
        <p><mark>[Founder Name]</mark> is recognized as the Founder of Beacon Educational Consult, having originated the concept and convened the founding partners. In recognition of this role, the Founder shall:</p>
        <ul>
          <li>Hold the title of Founder and <mark>[Coordinator / Production Lead]</mark> for the founding phase of the partnership, as set out in Article 6</li>
          <li>Receive <mark>[X]%</mark> of the general fund allocation described in Article 5.1, in addition to any share earned through authorship or operational roles</li>
          <li>Be designated "Founding Partner" in all official records of the partnership, a designation that continues to apply even after formal committee roles rotate</li>
        </ul>
        <p>This founder designation reflects origination and convening of the partnership. It does not entitle the Founder to sole ownership of jointly-developed works, a veto over partnership decisions, or a revenue share from materials authored by other partners beyond what is set out in Article 5. All such matters remain governed by the collective decision-making process in Article 6.2.</p>

        <h4>2.3 Founder's Role in Production</h4>
        <p>In addition to the Founder's governance role, <mark>[Founder Name]</mark> shall also serve as a contributing author and reviewer within the production workflow (Article 3), with subject specialism in English Language, Computing, and Integrated Science. Materials authored by the Founder under an assigned consortium project are jointly-owned works per Article 4.1 and revenue-shared per Article 5.1, on the same basis as any other partner's authored work — the Founder's authorship contributions are compensated separately from, and in addition to, the founder allocation in Article 2.2.</p>

        <h4>2.4 Admission of New Partners</h4>
        <p>New partners may be admitted by <mark>[unanimous / two-thirds]</mark> agreement of existing partners, and shall be bound by this agreement upon signing. New partners' share of revenue and ownership shall be agreed in writing at the point of admission.</p>

        <h4>2.5 Withdrawal of a Partner</h4>
        <p>A partner may withdraw with <mark>[X weeks/months]</mark> written notice. On withdrawal, the partner retains attribution as author of works they created, but forfeits any ongoing share of future revenue from jointly-owned works unless otherwise agreed. Materials already authored individually remain governed by Article 4 (Ownership).</p>
      </section>

      {/* Article 3 */}
      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 3</span> Production Workflow</h3>
        <p>All materials produced under this partnership shall follow the workflow below, to ensure curriculum accuracy, consistency, and quality before release for sale.</p>
        <div className={styles.tblWrap}>
          <table>
            <thead><tr><th>Stage</th><th>Description</th><th>Responsible</th></tr></thead>
            <tbody>
              <tr><td>1. Planning &amp; Assignment</td><td>Identify needed materials per subject/grade/term against the NaCCA curriculum map; assign a lead author</td><td>Production Lead</td></tr>
              <tr><td>2. Drafting</td><td>Lead author produces first draft using the consortium's standard template, citing NaCCA indicator codes</td><td>Lead Author</td></tr>
              <tr><td>3. Curriculum Alignment Check</td><td>A second partner verifies indicator coverage, sequencing, and grade-appropriateness</td><td>Reviewing Partner</td></tr>
              <tr><td>4. Editorial Review</td><td>Check language, formatting, house style, and (for exams) answer accuracy and mark allocation</td><td>Editor</td></tr>
              <tr><td>5. Pilot Use <em>(recommended)</em></td><td>Trial the material in a live classroom for one unit before wide release</td><td>Author / volunteer</td></tr>
              <tr><td>6. Approval &amp; Release</td><td>Final sign-off; format into sellable form (PDF/print); add to catalog</td><td>Steering Committee</td></tr>
              <tr><td>7. NaCCA Submission <em>(textbooks/workbooks only)</em></td><td>Submit to NaCCA for evaluation and approval listing</td><td>Production Lead</td></tr>
              <tr><td>8. Distribution &amp; Sales</td><td>Sell via agreed channels; track sales centrally</td><td>Sales/Distribution Lead</td></tr>
              <tr><td>9. Revision Cycle</td><td>Review and update at least annually; track version numbers</td><td>Original Author + Reviewer</td></tr>
            </tbody>
          </table>
        </div>
        <p>Textbooks and workbooks intended for use as core instructional material should be submitted through NaCCA's textbook evaluation process for approval listing. Schemes of work, lesson plans, and exam questions do not require this approval and may be released to market once internal review (Stages 1–6) is complete.</p>
      </section>

      {/* Article 4 */}
      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 4</span> Ownership of Materials</h3>
        <h4>4.1 Jointly-Developed Works</h4>
        <p>Materials developed as part of an assigned consortium project (per Article 3) are jointly owned by the partnership as a whole, regardless of which individual partner authored the first draft.</p>
        <h4>4.2 Individually-Authored Works</h4>
        <p>A partner who independently develops material outside an assigned consortium project, using the consortium's branding and distribution channels, retains <mark>[sole / majority]</mark> ownership, subject to a revenue share with the partnership as agreed in Article 5.</p>
        <h4>4.3 Attribution</h4>
        <p>All materials shall credit the lead author(s) by name, alongside the consortium name, regardless of ownership classification.</p>
        <h4>4.4 Use of Materials by Member Schools</h4>
        <p><mark>[Specify here whether member schools/teachers receive any discount, free access, or first-rights to materials produced, versus outside schools who pay full price.]</mark></p>
      </section>

      {/* Article 5 */}
      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 5</span> Revenue Sharing</h3>
        <h4>5.1 Revenue Split — Jointly-Developed Works</h4>
        <p>Net revenue (after production and distribution costs) from jointly-developed works shall be split as follows:</p>
        <ul>
          <li><mark>[X]%</mark> to the lead/contributing author(s)</li>
          <li><mark>[X]%</mark> to the partnership's general fund (covering operating costs, reinvestment, and reserves)</li>
          <li><mark>[X]%</mark> distributed equally among all active partners</li>
        </ul>
        <h4>5.2 Revenue Split — Individually-Authored Works</h4>
        <p>Net revenue from individually-authored works sold through consortium channels shall be split:</p>
        <ul>
          <li><mark>[X]%</mark> to the author</li>
          <li><mark>[X]%</mark> to the partnership's general fund</li>
        </ul>
        <h4>5.3 Financial Reporting</h4>
        <p>The Treasurer shall maintain sales and revenue records and provide a financial statement to all partners at least once per term.</p>
        <h4>5.4 Use of the General Fund</h4>
        <p>The general fund shall be used for <mark>[printing/production costs, marketing, NaCCA submission fees, administrative costs, reserve for reinvestment]</mark>. Any expenditure above <mark>[amount]</mark> requires approval by a majority of partners.</p>
      </section>

      {/* Article 6 */}
      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 6</span> Governance</h3>

        <h4>6.1 Steering Committee Roles</h4>
        <div className={styles.tblWrap}>
          <table>
            <thead><tr><th>Role</th><th>Responsibility</th></tr></thead>
            <tbody>
              <tr><td><strong>Founder / Coordinator</strong></td><td>Overall strategic direction, convenes steering committee, primary point of contact for external partners and GES</td></tr>
              <tr><td><strong>Production Lead</strong></td><td>Maintains the materials pipeline, assigns authors, tracks progress through the production workflow</td></tr>
              <tr><td><strong>Quality / Curriculum Officer</strong></td><td>Owns curriculum alignment checks, editorial standards, and NaCCA compliance across all materials</td></tr>
              <tr><td><strong>Sales &amp; Distribution Lead</strong></td><td>Manages school relationships, pricing, order fulfilment, and marketing of Beacon materials</td></tr>
              <tr><td><strong>Treasurer</strong></td><td>Manages the general fund, revenue distribution, and financial reporting to partners</td></tr>
              <tr><td><strong>Secretary</strong></td><td>Maintains partner records, meeting minutes, and version history of this agreement</td></tr>
            </tbody>
          </table>
        </div>

        <h4>6.2 Departmental Structure</h4>
        <p>Beacon Educational Consult shall operate through four academic departments, each led by a Head of Department (HoD) appointed by the steering committee.</p>
        <div className={styles.tblWrap}>
          <table>
            <thead><tr><th>Department</th><th>Levels</th><th>Subjects</th></tr></thead>
            <tbody>
              <tr><td><strong>Pre-School</strong></td><td>Nursery, Kindergarten</td><td>Early childhood learning activities</td></tr>
              <tr><td><strong>Lower Primary</strong></td><td>Basic 1, 2, 3</td><td>English Language, French Language, Ghanaian Language, Mathematics, Integrated Science, History, RME, Creative Arts &amp; Design</td></tr>
              <tr><td><strong>Upper Primary</strong></td><td>Basic 4, 5, 6</td><td>English Language, French Language, Ghanaian Language, Mathematics, Integrated Science, History, RME, Computing, Creative Arts &amp; Design</td></tr>
              <tr><td><strong>JHS</strong></td><td>Basic 7, 8, 9</td><td>English Language, French Language, Ghanaian Language, Mathematics, Integrated Science, Social Studies, RME, Computing, Creative Arts &amp; Design, Career Technology</td></tr>
            </tbody>
          </table>
        </div>

        <h4>6.3 Duties of a Head of Department</h4>
        <ul>
          <li>Maintain the department's production schedule, tracking what materials are due, who is authoring them, and what stage each piece is at</li>
          <li>Assign subjects and grade levels to members based on their declared expertise as submitted through Beacon's member registration form</li>
          <li>Ensure the department's output covers all subjects and grade levels within its remit, with no gaps in the catalog</li>
          <li>Review all materials for curriculum alignment before passing them to the Quality/Curriculum Officer for final sign-off</li>
          <li>Return below-standard drafts to the author with specific written feedback rather than self-editing</li>
          <li>Convene department meetings at least once per term to review progress, resolve blockers, and plan the next production cycle</li>
          <li>Monitor member participation and flag persistent non-contribution to the steering committee</li>
          <li>Submit a termly department report to the steering committee covering materials completed, in-progress, quality concerns, and professional development needs</li>
          <li>Identify subject-area topics suitable for Beacon's workshops, seminars, and conferences, and co-design event content falling within the department's scope</li>
        </ul>

        <h4>6.4 Duties of Department Members</h4>
        <ul>
          <li>Accept authorship assignments from the Head of Department for specific materials at their declared grade level and subject</li>
          <li>Produce drafts using Beacon's standard templates, citing the correct NaCCA content and performance indicators throughout</li>
          <li>Submit drafts by the agreed deadline, or communicate early if a deadline cannot be met</li>
          <li>Review at least one other member's draft per term, checking curriculum alignment, sequencing, and grade-appropriateness</li>
          <li>Provide specific written feedback on reviewed drafts within the agreed review window</li>
          <li>Pilot assigned materials in their own classroom where feasible, and report practical findings to the Head of Department</li>
          <li>Engage in at least one professional development activity per term</li>
          <li>Share any new curriculum guidance, GES circulars, or NaCCA updates relevant to their subject with the department promptly</li>
          <li>Attend department meetings and respond to department communications within a reasonable timeframe</li>
        </ul>

        <h4>6.5 Subject Assignment</h4>
        <p>Members shall declare their subject expertise and preferred authorship/review roles via Beacon's standard member registration form. Heads of Department use these declarations to assign work. Members may declare themselves as: <strong>Lead Author</strong> (confident to produce first drafts), <strong>Reviewer</strong> (able to peer-review but not yet lead-author), or <strong>Both</strong>. Subject assignments are reviewed termly and may be updated as members' expertise and confidence grow.</p>

        <h4>6.6 Decision-Making</h4>
        <p>Routine production and sales decisions are made by the relevant role-holder. Major decisions — admitting or removing partners, changing revenue splits, large expenditure, amending this agreement — require a vote as set out in Article 10.</p>

        <h4>6.7 Meetings</h4>
        <p>The full partnership shall meet <mark>[frequency]</mark> to review the production pipeline, sales performance, and finances. Department meetings shall be held at least once per term.</p>
      </section>

      {/* Articles 7–10 */}
      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 7</span> Quality Assurance</h3>
        <p>No material shall be released for sale without completing Stages 1–6 of the production workflow in Article 3. The Quality/Curriculum Officer holds authority to block release of any material that has not passed the curriculum alignment and editorial review stages, even if the original timeline is delayed as a result.</p>
        <p>All released materials shall carry a version number and review date so that schools are always informed of the edition in use.</p>
      </section>

      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 8</span> Standard Templates</h3>
        <p>All materials produced under Beacon Educational Consult shall be drafted using Beacon's approved standard templates, maintained by the Quality/Curriculum Officer. Templates exist for: Schemes of Work, Lesson Notes, End-of-Term Examination Questions, Textbooks, and Workbooks.</p>
        <p>Use of the standard template is a requirement for a draft to proceed to peer review. Templates may be updated termly by the Quality/Curriculum Officer following partner consultation.</p>
      </section>

      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 9</span> Confidentiality and Non-Compete</h3>
        <p>Partners agree not to independently reproduce or sell jointly-owned Beacon materials outside the partnership without written consent from the other partners.</p>
        <p className={styles.note}>Optional: partners agree not to develop directly competing materials for sale outside the consortium while an active partner, to be reviewed if this proves impractical.</p>
      </section>

      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Article 10</span> Amendments and Dispute Resolution</h3>
        <h4>10.1 Amendments</h4>
        <p>This agreement may be amended by <mark>[two-thirds majority / unanimous]</mark> vote of partners, provided proposed changes are circulated at least <mark>[X]</mark> days in advance.</p>
        <h4>10.2 Dispute Resolution</h4>
        <p>Disputes between partners shall first be addressed through internal discussion at a steering committee meeting. If unresolved, partners agree to seek mediation before pursuing formal legal action.</p>
      </section>

      {/* Signatures */}
      <section className={styles.article}>
        <h3 className={styles.articleTitle}><span className={styles.num}>Adoption</span></h3>
        <p>This partnership agreement was adopted by the undersigned partners on the date below.</p>
        <p className={styles.dateLine}>Date: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <div className={styles.sigGrid}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={styles.sigEntry}>
              <div className={styles.sigLine} />
              <span className={styles.sigLabel}>Partner Name &amp; Signature</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

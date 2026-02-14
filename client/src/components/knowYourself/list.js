import React from 'react';

function List() {
  return (
    <div>
      <section className="row pb-5" style={{ padding: "20px", color: "black" }}>
        <div className="col-md-6">
          <h2 className="h3">Cultivate a Positive Mindset</h2>
          <ul>
            <li>Embrace self-compassion and gratitude.</li>
            <li>Reframe challenges as opportunities for growth.</li>
            <li>Develop a growth mindset for resilience.</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h2 className="h3">Build Healthy Habits</h2>
          <ul>
            <li>Regular exercise: Boost mood and reduce stress.</li>
            <li>Balanced diet: Prioritize fruits, vegetables, whole grains.</li>
            <li>Quality sleep: Essential for cognitive function and well-being.</li>
            <li>Mindfulness and relaxation techniques: Manage stress and improve focus.</li>
          </ul>
        </div>
      </section>
      
      <section className="row" style={{ padding: "20px", color: "black" }}>
        <div className="col-md-6">
          <h2 className="h3">Develop Resilience</h2>
          <ul>
            <li>Stress management: Journaling, talking to friends, seeking help.</li>
            <li>Strong support networks: Connect with friends, family, mentors.</li>
            <li>Seek professional help: Normalize and encourage consultation.</li>
          </ul>
        </div>
        
        <div className="col-md-6">
          <h2 className="h3">Additional Resources</h2>
          <ul>
            <li>Snehita Well-being website: More resources and support.</li>
            <li>Counseling services: Confidential consultations, workshops, activities.</li>
            <li>Online resources: Mental health information and tools.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default List;

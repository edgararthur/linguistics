import React from 'react';
import Card from '../shared/Card';

export default function Mission() {
  return (
    <Card className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
      <p className="text-gray-600 leading-relaxed">
        The Linguistics Association of Ghana aims to advance scholarship concerning the role of language in society as it relates to group and individual behaviour. The purposes of LAG are:
        <br />
        <br />
        <h5 className='text-lg text-gray-800 font-medium'><span>1.</span> Provide an international forum to foster the growth and development of scholarly research in the area of language and social psychology;</h5>
        <br />
        <h5 className='text-lg text-gray-800 font-medium'><span>2.</span> Provide opportunities for our members to meet regularly in order to share and develop socially significant research;</h5>
        <br />
        <h5 className='text-lg text-gray-800 font-medium'><span>3.</span> Promote scholarship that addresses pressing issues of our time as well as historically rooted social issues; and</h5>
        <br />
        <h5 className='text-lg text-gray-800 font-medium'><span>4.</span> Facilitate opportunities to publish, present, and promote language and social psychology research.</h5>
        <br />
      </p>
    </Card>
  );
}
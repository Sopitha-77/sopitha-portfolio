import React from 'react';
import { Github, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center w-full">
        <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Get In Touch
        </h2>
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          I'm currently looking for new opportunities and my inbox is always open. Whether you have a question or just want to say hi, I'll get back to you!
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a 
            href="mailto:sopithasopitha7@gmail.com"
            className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/50 flex items-center gap-2"
          >
            <Mail size={20} />
            Say Hello
          </a>
          <a 
            href="https://github.com/Sopitha"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-slate-800 border border-slate-600 rounded-full hover:border-indigo-500 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Github size={20} />
            View GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
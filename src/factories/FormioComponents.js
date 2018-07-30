const components = {};
const groups = {
  __component: {
    title: 'Basic Components'
  },
  advanced: {
    title: 'Special Components'
  },
  layout: {
    title: 'Layout Components'
  }
};

export const FormioComponents = {
  addGroup: (name, group) => {
    groups[name] = group;
  },
  register: (type, component, group) => {
    if (!components[type]) {
      components[type] = component;
    }
    else {
      Object.assign(components[type], component);
    }

    // Set the type for this component.
    if (!components[type].group) {
      components[type].group = group || '__component';
    }
  },
  getComponent: (type) => {
    return components.hasOwnProperty(type) ? components[type] : components['custom'];
  },
  components,
  groups
};

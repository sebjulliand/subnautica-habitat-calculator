import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import RawMaterials from '../database/raw_materials.json'

import BasicMaterials from '../database/basic_materials.json'
import AdvancedMaterials from '../database/advanced_materials.json'

import Modules from '../database/modules.json'

class Calculator extends Component {

  constructor() {
    super();
    this.state = {
      selection: []
    }
    this.allMaterials = [].concat(RawMaterials)
      .concat(BasicMaterials)
      .concat(AdvancedMaterials)
      .concat(Modules);

  }

  createSelectables(name, materials) {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {name}
        </ExpansionPanelSummary>
        {materials.map((material, id) =>
          <ExpansionPanelDetails key={"name_" + id}>
            <IconButton style={{padding: 0}} color="primary" aria-label="Add material to the list" onClick={() => {this.handleSelection(true, material)}}>
              <AddIcon fontSize="small" />
            </IconButton>
            <IconButton style={{padding: 0}} color="primary" aria-label="Remove material from the list" onClick={() => {this.handleSelection(false, material)}}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <span style={{paddingLeft:10}}/>
            {material.name}
          </ExpansionPanelDetails>
        )}
      </ExpansionPanel>
    );
  }

  handleSelection(add, material) {
    let selection = this.state.selection;
    if (add) {
      selection.push(material)
    }
    else {
      selection.splice(selection.lastIndexOf(material), 1)
    }

    this.setState({
      selection: selection
    })
  }

  getMaterial(id) {
    let searchedMaterial;
    this.allMaterials.forEach(material => {
      if (material.id == id) {
        searchedMaterial = material;
      }
    });

    if (!searchedMaterial) {
      console.log("Uknown material ID: " + id);
    }

    return searchedMaterial;
  }

  getRecipe(materials) {
    let recipe = [];
    materials.forEach(material => {
      this.computeRecipe(recipe, material);
    });
    return recipe;
  }

  computeRecipe(recipe, material, count) {
    if (!count) {
      count = 1;
    }

    material.recipe.forEach(ingredient => {
      if (!ingredient.quantity) {
        ingredient.quantity = 1;
      }

      let subMaterial = this.getMaterial(ingredient.id);
      if (subMaterial.recipe) {
        this.computeRecipe(recipe, subMaterial, ingredient.quantity)
      }
      else {
        let foundIngredient = false;
        let amount = count * ingredient.quantity;
        recipe.forEach(ingredient => {
          if (ingredient.material.id == subMaterial.id) {
            foundIngredient = true;
            ingredient.quantity += amount;
          }
        });

        if (!foundIngredient) {
          recipe.push({ material: subMaterial, quantity: amount });
        }
      }
    });
  }

  getAllIngredients(materialId, count) {

  }

  render() {
    return (
      <React.Fragment>
        <Grid container spacing={16}>
          <Grid item m={4}>
            {this.createSelectables("Basic Materials", BasicMaterials)}
            {this.createSelectables("Advanced Materials", AdvancedMaterials)}
            {this.createSelectables("Modules", Modules)}
          </Grid>
          <Grid item m={8}>
            <ul>
              {this.state.selection.map((material, index) =>
                <li key={"selection_" + index}>{material.name}</li>
              )}
            </ul>
            <ul>
              {this.getRecipe(this.state.selection).map((ingredient, id) =>
                <li key={"material_" + id}>{ingredient.quantity}x {ingredient.material.name}</li>
              )}
            </ul>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Calculator;